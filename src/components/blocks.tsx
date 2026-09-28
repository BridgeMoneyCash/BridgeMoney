import Link from "next/link";
import type { ReactNode } from "react";
import { creatorById, creatorLabel, creatorPath, tokenByAddress, type Claim, type Creator, type Payout, type Token } from "@/config/seed";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, LockIcon } from "@/components/icons";
import { Avatar, PlatformGlyph, TokenArt, TokenThumb, Verified } from "@/components/ui/Art";
import { age, ago, usd, usdFees, usdShort } from "@/lib/format";
import { card } from "@/lib/ui";

export function SectionHead({
  title,
  children,
  pager,
  viewAll,
}: {
  title: ReactNode;
  children?: ReactNode;
  pager?: string;
  viewAll?: string;
}) {
  return (
    <div className="mb-4 flex min-w-0 flex-wrap items-center gap-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
      <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
        {pager && (
          <span className="hidden items-center gap-1 sm:inline-flex">
            <ChevronLeftIcon className="size-4" />
            <span className="tabular">{pager}</span>
            <ChevronRightIcon className="size-4" />
          </span>
        )}
        {viewAll && (
          <Link href={viewAll} className="inline-flex items-center gap-1 hover:text-foreground">
            View all <ArrowRightIcon className="size-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

/** Marks figures that come from the launch preview book rather than the chain. */
export function PreviewChip() {
  return (
    <span title="Preview figures. Live claims replace them once the fee router is published." className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
      Preview
    </span>
  );
}

export function CreatorName({ creator, className = "" }: { creator: Creator; className?: string }) {
  return (
    <span className={`inline-flex min-w-0 items-center gap-1 ${className}`}>
      <PlatformGlyph platform={creator.platform} />
      <span className="truncate">{creator.name}</span>
      {creator.verified && <Verified />}
    </span>
  );
}

/** Square launch card used by every token grid. */
export function TokenCard({ token }: { token: Token }) {
  const creator = creatorById(token.creatorId);
  return (
    <Link
      href={`/token/${token.address}`}
      className="group flex min-w-0 flex-col gap-2 rounded-2xl border border-border bg-card/60 p-2.5 transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-card"
    >
      <div className="relative">
        <div className="relative aspect-square w-full shrink-0">
          <TokenArt token={token} className="block size-full rounded-2xl bg-muted" />
          <div className="absolute right-2 bottom-2 size-10 overflow-hidden rounded-full border-2 border-background bg-background">
            <Avatar creator={creator} className="block size-full" />
          </div>
        </div>
        <span className="absolute top-2 left-2 rounded-full bg-background/80 px-1.5 py-0.5 text-[10px] text-muted-foreground tabular backdrop-blur">
          {age(token.launchedAt)}
        </span>
        {token.graduated && (
          <span className="absolute top-2 right-2 rounded-full bg-success/20 px-1.5 py-0.5 text-[10px] text-success">graduated</span>
        )}
      </div>
      <div className="min-w-0 px-0.5">
        <div className="flex min-w-0 items-center gap-1 text-sm">
          <span className="truncate font-medium">{token.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground">{token.ticker}</span>
        </div>
        <CreatorName creator={creator} className="w-full text-xs text-muted-foreground" />
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-xs">
          <span className="font-semibold tabular">
            {usdShort(token.mcap)} <span className="font-normal text-muted-foreground">MC</span>
          </span>
          <span className="font-semibold tabular">
            {usdFees(token.fees)} <span className="font-normal text-muted-foreground">Fees</span>
          </span>
          {token.accruing > 0 && <span className="text-muted-foreground tabular">{usd(token.accruing)} accruing</span>}
        </div>
      </div>
    </Link>
  );
}

export function TokenGrid({ tokens, wide = false }: { tokens: Token[]; wide?: boolean }) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${wide ? "lg:grid-cols-4 xl:grid-cols-5" : "xl:grid-cols-4"}`}>
      {tokens.map((t) => (
        <TokenCard key={t.address} token={t} />
      ))}
    </div>
  );
}

/** Wide ticker card for the scrolling launch strip. */
export function TickerCard({ token }: { token: Token }) {
  const creator = creatorById(token.creatorId);
  return (
    <Link
      href={`/token/${token.address}`}
      className="flex w-64 shrink-0 items-center gap-3 rounded-2xl border border-border bg-card/60 p-3 transition-colors hover:border-foreground/25"
    >
      <TokenThumb token={token} creator={creator} />
      <div className="min-w-0 flex-1 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <PlatformGlyph platform={creator.platform} />
          <span className="truncate">{creator.name}</span>
          {creator.verified && <Verified />}
          <span className="ml-auto shrink-0 tabular">{age(token.launchedAt)}</span>
        </div>
        <div className="truncate text-sm font-medium text-foreground">
          {token.name} <span className="text-muted-foreground">{token.ticker}</span>
        </div>
        <div className="flex gap-2 tabular">
          <span className="font-semibold text-foreground">{usdShort(token.mcap)}</span>
          <span className="text-muted-foreground">MC</span>
          <span className="font-semibold text-foreground">{usdFees(token.fees)}</span>
          <span className="text-muted-foreground">Fees</span>
        </div>
      </div>
    </Link>
  );
}

export function Marquee({ children, seconds = 60 }: { children: ReactNode; seconds?: number }) {
  return (
    <div className="group/marquee mask-fade-x w-full overflow-hidden">
      <div className="animate-marquee flex w-max gap-3" style={{ ["--marquee-duration" as string]: `${seconds}s` }}>
        {children}
        {children}
      </div>
    </div>
  );
}

/** One claim: the amount taken from escrow and how it split. */
export function ClaimRow({ claim }: { claim: Claim }) {
  const creator = creatorById(claim.creatorId);
  const recipient = claim.amount * 0.8;
  return (
    <li className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card/60 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="text-lg font-semibold tabular">{usd(claim.amount)}</div>
        <div className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
          <span className="shrink-0">claimed for</span>
          <PlatformGlyph platform={creator.platform} />
          <Link href={creatorPath(creator)} className="truncate font-medium text-foreground hover:underline">
            {creatorLabel(creator)}
          </Link>
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground tabular">
          80% · {usd(recipient)} to recipient · 20% · {usd(claim.amount - recipient)} to treasury
        </div>
      </div>
      <Avatar creator={creator} className="size-9 shrink-0 rounded-full" />
      <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
        <span className="tabular">{ago(claim.minutesAgo)}</span>
        <span title="Transaction links go live with the fee router" className="inline-flex items-center gap-1 opacity-60">
          tx <LockIcon className="size-3" />
        </span>
      </div>
    </li>
  );
}

export function ClaimList({ claims }: { claims: Claim[] }) {
  return (
    <ul className="space-y-2">
      {claims.map((c) => (
        <ClaimRow key={c.id} claim={c} />
      ))}
    </ul>
  );
}

/** One payout: a creator's share leaving in dollars. */
export function PayoutRow({ payout }: { payout: Payout }) {
  const creator = creatorById(payout.creatorId);
  const token = tokenByAddress(payout.tokenAddress);
  return (
    <li className="min-w-0">
      <Link href={creatorPath(creator)} className="block min-w-0">
        <div className="glass flex min-w-0 items-center gap-2 rounded-2xl px-3 py-2.5 opacity-80 transition-all hover:opacity-100 sm:gap-3 sm:px-4 sm:py-3">
          <div className="min-w-0 flex-1">
            <div className="chrome-text text-xl leading-tight font-semibold tabular sm:text-2xl">{usd(payout.amount)}</div>
            <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground sm:text-sm">
              <span className="shrink-0">sent to</span>
              <span className="truncate font-medium text-foreground">{creatorLabel(creator)}</span>
              {creator.verified && <Verified className="size-3.5" />}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {token && (
              <div className="relative">
                <TokenArt token={token} className="block size-8 rounded-full sm:size-9" />
              </div>
            )}
            <div className="relative">
              <Avatar creator={creator} className="block size-8 rounded-full sm:size-9" />
              <span className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full border border-background bg-black">
                <PlatformGlyph platform={creator.platform} className="size-2.5" />
              </span>
            </div>
          </div>
          <div className="w-7 shrink-0 text-right text-xs text-muted-foreground tabular sm:w-8">{ago(payout.minutesAgo)}</div>
        </div>
      </Link>
    </li>
  );
}

export function PayoutList({ payouts }: { payouts: Payout[] }) {
  if (payouts.length === 0) {
    return (
      <div className={`${card} flex flex-col items-center justify-center p-8 text-center`}>
        <div className="font-medium">No payouts yet</div>
        <div className="mt-1 text-sm text-muted-foreground">A payout shows up here as soon as a creator share leaves in dollars.</div>
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {payouts.map((p) => (
        <PayoutRow key={p.id} payout={p} />
      ))}
    </ul>
  );
}

export function StatCard({ label, value, note, size = "text-2xl" }: { label: ReactNode; value: ReactNode; note?: ReactNode; size?: string }) {
  return (
    <div className={`${card} p-5`}>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`${size} font-semibold tabular`}>{value}</div>
      {note && <div className="text-xs text-muted-foreground">{note}</div>}
    </div>
  );
}

export function Tile({ label, value, note, tone }: { label: ReactNode; value: ReactNode; note?: ReactNode; tone?: "up" | "down" }) {
  return (
    <div className="min-w-0 rounded-xl bg-muted/50 px-3 py-2.5">
      <dt className="truncate text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate font-semibold tabular">{value}</dd>
      {note && (
        <dd className={`truncate text-[11px] tabular ${tone === "down" ? "text-destructive" : tone === "up" ? "text-success" : "text-muted-foreground"}`}>{note}</dd>
      )}
    </div>
  );
}
