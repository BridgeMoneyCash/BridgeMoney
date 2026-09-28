import { NextResponse } from "next/server";
import { batch } from "@/lib/chain-server";

export const dynamic = "force-dynamic";

/*
 * Read-only JSON-RPC relay for the browser. Some networks intercept the
 * chain's public RPC host, so the page reads through this server instead.
 * Only read methods pass; nothing here can move funds.
 */
const ALLOWED = new Set(["eth_call", "eth_blockNumber", "eth_getBalance", "eth_chainId", "eth_gasPrice"]);
const MAX_CALLS = 20;

type Call = { jsonrpc?: string; id?: number; method: string; params?: unknown[] };

export async function POST(request: Request) {
  let body: Call | Call[];
  try {
    body = (await request.json()) as Call | Call[];
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const calls = Array.isArray(body) ? body : [body];
  if (calls.length === 0 || calls.length > MAX_CALLS) {
    return NextResponse.json({ error: "Too many calls." }, { status: 400 });
  }
  for (const c of calls) {
    if (!c || typeof c.method !== "string" || !ALLOWED.has(c.method)) {
      return NextResponse.json({ error: `Method not allowed: ${c?.method}` }, { status: 400 });
    }
  }
  try {
    const results = await batch(calls.map((c) => ({ method: c.method, params: c.params ?? [] })));
    const out = calls.map((c, i) => ({ jsonrpc: "2.0", id: c.id ?? i, result: results[i] }));
    return NextResponse.json(Array.isArray(body) ? out : out[0], { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "The chain could not be reached." }, { status: 502 });
  }
}
