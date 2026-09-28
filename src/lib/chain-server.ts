import "server-only";
import { BRAND, CHAIN, TOKEN, serverRpc } from "@/config/brand";

/* Server-side chain reads. One JSON-RPC batch per request, configured
   endpoint first, public fallback second. Nothing here needs a key. */

type RpcCall = { method: string; params: unknown[] };

// An endpoint that just failed sits out for a minute, so every read does not
// pay its timeout again. Some networks intercept the primary host's DNS.
const benched = new Map<string, number>();
const BENCH_MS = 60_000;

function endpoints() {
  const all = [serverRpc(), CHAIN.fallbackRpc].filter((url, i, list) => list.indexOf(url) === i);
  const now = Date.now();
  const ready = all.filter((url) => (benched.get(url) ?? 0) < now);
  return ready.length ? ready : all;
}

export async function batch(calls: RpcCall[]): Promise<(string | null)[]> {
  if (calls.length === 0) return [];
  let lastError: unknown;
  for (const url of endpoints()) {
    try {
      const out: (string | null)[] = new Array(calls.length).fill(null);
      // Chunked: public endpoints reject large batches with an HTML error page.
      for (let start = 0; start < calls.length; start += 20) {
        const chunk = calls.slice(start, start + 20);
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(chunk.map((c, i) => ({ jsonrpc: "2.0", id: start + i, method: c.method, params: c.params }))),
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`rpc ${res.status}`);
        const body = (await res.json()) as { id: number; result?: string }[];
        if (!Array.isArray(body)) throw new Error("rpc batch unsupported");
        for (const item of body) out[item.id] = item.result ?? null;
      }
      return out;
    } catch (error) {
      benched.set(url, Date.now() + BENCH_MS);
      lastError = error;
    }
  }
  throw lastError;
}

const ethCall = (to: string, data: string): RpcCall => ({ method: "eth_call", params: [{ to, data }, "latest"] });

function word(hex: string | null, index: number): bigint | null {
  if (!hex || hex.length < 2 + (index + 1) * 64) return null;
  return BigInt("0x" + hex.slice(2 + index * 64, 2 + (index + 1) * 64));
}

const SEL = {
  latestRoundData: "0xfeaf968c",
  totalSupply: "0x18160ddd",
  decimals: "0x313ce567",
  balanceOf: "0x70a08231",
};

export type ChainFacts = {
  block: number | null;
  gasGwei: number | null;
  ethUsd: number | null;
  readAt: string;
};

/** Live facts shown across the site: latest block, gas price, ETH / USD. */
export async function readChainFacts(): Promise<ChainFacts> {
  const readAt = new Date().toISOString();
  try {
    const [blockHex, gasHex, round] = await batch([
      { method: "eth_blockNumber", params: [] },
      { method: "eth_gasPrice", params: [] },
      ethCall(CHAIN.ethUsdFeed, SEL.latestRoundData),
    ]);
    const answer = word(round, 1);
    return {
      block: blockHex ? Number(BigInt(blockHex)) : null,
      gasGwei: gasHex ? Number(BigInt(gasHex)) / 1e9 : null,
      ethUsd: answer && answer > 0n ? Number(answer) / 1e8 : null,
      readAt,
    };
  } catch {
    return { block: null, gasGwei: null, ethUsd: null, readAt };
  }
}

export type TokenFacts = { supply: number | null; burned: number | null };

const DEAD = "0x000000000000000000000000000000000000dead";

/** Supply and burned balance of the project token, once its address is published. */
export async function readTokenFacts(): Promise<TokenFacts> {
  if (!TOKEN.isLive) return { supply: null, burned: null };
  try {
    const pad = DEAD.slice(2).padStart(64, "0");
    const [supplyHex, decHex, deadHex] = await batch([
      ethCall(BRAND.ca, SEL.totalSupply),
      ethCall(BRAND.ca, SEL.decimals),
      ethCall(BRAND.ca, SEL.balanceOf + pad),
    ]);
    const decimals = decHex && decHex !== "0x" ? Number(BigInt(decHex)) : 18;
    const scale = 10 ** decimals;
    return {
      supply: supplyHex && supplyHex !== "0x" ? Number(BigInt(supplyHex)) / scale : null,
      burned: deadHex && deadHex !== "0x" ? Number(BigInt(deadHex)) / scale : null,
    };
  } catch {
    return { supply: null, burned: null };
  }
}
