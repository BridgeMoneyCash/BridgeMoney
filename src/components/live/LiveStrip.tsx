"use client";

import { BRAND, CHAIN, TOKEN, explorerToken } from "@/config/brand";
import { useChain } from "@/components/live/useChain";

/** One-line live status of Robinhood Chain, read through this site's server. */
export function LiveStrip({ className = "" }: { className?: string }) {
  const { data, failed } = useChain();
  const dot = failed ? "bg-destructive" : data ? "bg-success text-success" : "bg-muted-foreground";
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground ${className}`}>
      <span className="inline-flex items-center gap-1.5">
        <span className={`inline-block size-1.5 rounded-full ${dot} ${data && !failed ? "live-dot" : ""}`} />
        {failed ? `${CHAIN.name} unreachable` : `${CHAIN.name} live`}
      </span>
      <span className="tabular">Block {data?.block ? `#${data.block.toLocaleString("en-US")}` : "…"}</span>
      <span className="tabular">Gas {data?.gasGwei != null ? `${data.gasGwei.toFixed(3)} gwei` : "…"}</span>
      <span className="tabular">ETH {data?.ethUsd ? `$${data.ethUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "…"}</span>
      <span className="ml-auto">Chainlink ETH / USD · chain id {CHAIN.id}</span>
    </div>
  );
}

/** Burned share of the project token; waits calmly until the address is published. */
export function BurnCard() {
  const { data } = useChain(60_000);
  const supply = data?.token.supply ?? null;
  const burned = data?.token.burned ?? null;
  const share = supply && burned !== null ? (burned / supply) * 100 : null;
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card/60 p-5">
      <div className="text-sm text-muted-foreground">{BRAND.symbol} supply burned</div>
      <div className="text-4xl font-semibold tabular">{TOKEN.isLive ? (share !== null ? `${share.toFixed(2)}%` : "…") : "—"}</div>
      <div className="text-xs text-muted-foreground">
        {TOKEN.isLive ? (
          <>
            Balance of the dead address over total supply, read live from{" "}
            <a href={explorerToken(BRAND.ca)} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              the token
            </a>
            .
          </>
        ) : (
          <>Read live from the chain once the {BRAND.symbol} contract address is published at launch.</>
        )}
      </div>
    </div>
  );
}
