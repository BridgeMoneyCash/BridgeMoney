"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BRAND } from "@/config/brand";
import { CREATORS, TOKENS, creatorById, creatorLabel, creatorPath, PLATFORM_NAME } from "@/config/seed";
import { LogoMark } from "@/components/Logo";
import { SearchIcon } from "@/components/icons";
import { Avatar, PlatformGlyph, TokenThumb } from "@/components/ui/Art";
import { CaIconButton, CaPill } from "@/components/CopyCa";
import { ConnectButton } from "@/components/wallet/WalletUi";
import { btn } from "@/lib/ui";
import { usdFees } from "@/lib/format";

function Search() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
        setOpen(true);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^[@$]/, "");
    if (!q) return [];
    const tokens = TOKENS.filter((t) => t.name.toLowerCase().includes(q) || t.ticker.toLowerCase().includes(q))
      .slice(0, 5)
      .map((t) => ({ kind: "token" as const, href: `/token/${t.address}`, token: t }));
    const creators = CREATORS.filter((c) => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q))
      .slice(0, 4)
      .map((c) => ({ kind: "creator" as const, href: creatorPath(c), creator: c }));
    return [...tokens, ...creators];
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div ref={box} className="relative min-w-0 flex-1 md:mx-auto md:max-w-xl">
      <label className="flex h-10 items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 text-sm text-muted-foreground focus-within:border-foreground/40">
        <SearchIcon className="size-4 shrink-0" />
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") setCursor((c) => Math.min(c + 1, results.length - 1));
            if (e.key === "ArrowUp") setCursor((c) => Math.max(c - 1, 0));
            if (e.key === "Enter" && results[cursor]) go(results[cursor].href);
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Search tokens or creators"
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 text-[10px] sm:inline">⌘K</kbd>
      </label>
      {open && query.trim() && (
        <div className="card-lift absolute inset-x-0 top-12 z-50 overflow-hidden rounded-2xl border border-white/10 bg-card p-1.5">
          {results.length === 0 && <div className="px-3 py-3 text-sm text-muted-foreground">Nothing matches “{query.trim()}”.</div>}
          {results.map((r, i) => (
            <Link
              key={r.href}
              href={r.href}
              onClick={() => go(r.href)}
              onMouseEnter={() => setCursor(i)}
              className={`flex items-center gap-3 rounded-xl px-2.5 py-2 ${i === cursor ? "bg-accent" : ""}`}
            >
              {r.kind === "token" ? (
                <>
                  <TokenThumb token={r.token} creator={creatorById(r.token.creatorId)} className="size-9 rounded-lg" badge="size-4 -right-1 -bottom-1" />
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="truncate font-medium text-foreground">
                      {r.token.name} <span className="text-muted-foreground">{r.token.ticker}</span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">fees to {creatorLabel(creatorById(r.token.creatorId))}</div>
                  </div>
                  <div className="text-xs tabular text-muted-foreground">{usdFees(r.token.fees)}</div>
                </>
              ) : (
                <>
                  <Avatar creator={r.creator} className="size-9 rounded-full" />
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="truncate font-medium text-foreground">{r.creator.name}</div>
                    <div className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <PlatformGlyph platform={r.creator.platform} />
                      {PLATFORM_NAME[r.creator.platform]} · {creatorLabel(r.creator)}
                    </div>
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky z-30 border-b border-border bg-background/85 backdrop-blur" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <Link href="/" aria-label={`${BRAND.name} home`} className="flex shrink-0 items-center gap-2 md:hidden">
          <LogoMark className="size-8" />
        </Link>
        <Search />
        <div className="hidden lg:flex">
          <CaPill />
        </div>
        <div className="flex lg:hidden">
          <CaIconButton />
        </div>
        <div className="hidden sm:flex">
          <Link href="/launch" className={`${btn.primary} ${btn.md}`}>
            Launch
          </Link>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
}
