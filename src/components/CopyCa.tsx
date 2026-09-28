"use client";

import { useState } from "react";
import { BRAND, TOKEN, explorerToken, shortAddress } from "@/config/brand";
import { CheckIcon, CopyIcon, GithubIcon, XIcon } from "@/components/icons";

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!TOKEN.isLive) return;
    try {
      await navigator.clipboard.writeText(BRAND.ca);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the address stays visible to select by hand.
    }
  };
  return { copied, copy, live: TOKEN.isLive };
}

/**
 * Header pill. The caller decides visibility (it is wrapped in a `hidden md:flex`
 * container), so this component never sets its own display.
 */
export function CaPill() {
  const { copied, copy, live } = useCopy();
  return (
    <button
      type="button"
      onClick={copy}
      disabled={!live}
      title={live ? "Copy contract address" : "The contract address is published at launch"}
      aria-label={live ? `Copy ${BRAND.symbol} contract address` : `${BRAND.symbol} contract address is published at launch`}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card/60 pr-2 pl-3 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:cursor-default disabled:hover:border-border disabled:hover:text-muted-foreground"
    >
      <span className="font-semibold text-foreground">{BRAND.symbol}</span>
      <span className="font-mono tabular">{live ? shortAddress(BRAND.ca, 6, 4) : "CA soon"}</span>
      <span className="grid size-6 place-items-center rounded-full bg-muted">
        {copied ? <CheckIcon className="size-3 text-success" /> : <CopyIcon className="size-3" />}
      </span>
    </button>
  );
}

/** Compact square button for the mobile header. */
export function CaIconButton() {
  const { copied, copy, live } = useCopy();
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={live ? `Copy ${BRAND.symbol} contract address` : `${BRAND.symbol} contract address is published at launch`}
      title={live ? "Copy contract address" : "CA published at launch"}
      className="inline-flex h-9 items-center gap-1 rounded-full border border-border bg-card/60 px-2.5 text-[11px] font-semibold text-foreground"
    >
      {copied ? <CheckIcon className="size-3.5 text-success" /> : <CopyIcon className="size-3.5 text-muted-foreground" />}
      CA
    </button>
  );
}

/** Token contract block for the footer. Shows a calm placeholder until launch. */
export function CaBlock() {
  const { copied, copy, live } = useCopy();
  return (
    <div className="w-full max-w-[340px]">
      <div className="text-xs text-muted-foreground">{BRAND.symbol} contract · Robinhood Chain</div>
      <div className="mt-2 flex items-center gap-2 rounded-full border border-border bg-card/60 p-1 pl-3.5">
        <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] tabular">
          {live ? shortAddress(BRAND.ca, 8, 6) : "Published at launch"}
        </span>
        <button
          type="button"
          onClick={copy}
          disabled={!live}
          aria-label="Copy contract address"
          className="grid size-8 place-items-center rounded-full bg-muted transition-colors hover:bg-accent disabled:opacity-40"
        >
          {copied ? <CheckIcon className="size-3.5 text-success" /> : <CopyIcon className="size-3.5" />}
        </button>
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
        {live && (
          <a href={explorerToken(BRAND.ca)} target="_blank" rel="noreferrer" className="hover:text-foreground">
            Explorer
          </a>
        )}
        <a href={BRAND.x} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
          <XIcon className="size-3.5" /> @{BRAND.xHandle}
        </a>
        {BRAND.github && (
          <a href={BRAND.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
            <GithubIcon className="size-3.5" /> GitHub
          </a>
        )}
      </div>
    </div>
  );
}
