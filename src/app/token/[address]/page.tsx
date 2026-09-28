import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CLAIMS, PAYOUTS, PLATFORM_NAME, TOKENS, bookById, creatorById, creatorLabel, creatorPath, tokenByAddress } from "@/config/seed";
import { ClaimList, PayoutList, PreviewChip, SectionHead, Tile } from "@/components/blocks";
import { ChartLineIcon, LockIcon } from "@/components/icons";
import { Avatar, PlatformGlyph, TokenArt, Verified } from "@/components/ui/Art";
import { LiveStrip } from "@/components/live/LiveStrip";
import { compact, launchedLabel, pct, usd, usdFees, usdPrice, usdShort } from "@/lib/format";
import { btn, card } from "@/lib/ui";

type Params = { params: Promise<{ address: string }> };

export function generateStaticParams() {
  return TOKENS.map((t) => ({ address: t.address }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const token = tokenByAddress((await params).address);
  if (!token) return { title: "Token not found" };
  return { title: `${token.name} (${token.ticker})`, description: `${token.name} routes its creator fees to ${creatorLabel(creatorById(token.creatorId))} through Bridge Money.` };
}

export default async function TokenPage({ params }: Params) {
  const token = tokenByAddress((await params).address);
  if (!token) notFound();
  const creator = creatorById(token.creatorId);
  const book = bookById(creator.id);
  const claims = CLAIMS.filter((c) => c.creatorId === creator.id);
  const payouts = PAYOUTS.filter((p) => p.creatorId === creator.id);
  const owedShare = book.fees ? token.fees / book.fees : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-6">
          <div className={`${card} p-5 sm:p-6`}>
            <div className="flex flex-wrap items-start gap-5">
              <div className="relative shrink-0">
                <TokenArt token={token} className="block size-20 rounded-2xl bg-muted" />
                <div className="absolute -right-2 -bottom-2 size-8 overflow-hidden rounded-full border-2 border-background bg-background">
                  <Avatar creator={creator} className="block size-full" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight">{token.name}</h1>
                  <span className="text-lg text-muted-foreground">{token.ticker}</span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{token.graduated ? "Graduated to pool" : "On the curve"}</span>
                  <PreviewChip />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex min-w-0 items-center gap-1">
                    <PlatformGlyph platform={creator.platform} />
                    fees to
                    <Link href={creatorPath(creator)} className="inline-flex min-w-0 items-center gap-1.5 text-xs hover:underline">
                      <Avatar creator={creator} className="size-4 rounded-full" />
                      <span className="truncate font-medium text-foreground">{creator.name}</span>
                      {creator.verified && <Verified className="size-3.5" />}
                    </Link>
                  </span>
                  <span>·</span>
                  <span>Launched {launchedLabel(token.launchedAt)}</span>
                </div>
                <p className="mt-3 max-w-2xl text-sm whitespace-pre-line text-muted-foreground">
                  {token.description} Fees to {creatorLabel(creator)} via Bridge Money
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Trade", "Chart", "Explorer"].map((label) => (
                    <span
                      key={label}
                      title="Opens when the token is live on Robinhood Chain"
                      className={`${btn.outline} h-8 cursor-default gap-1.5 rounded-full px-3 text-xs text-muted-foreground`}
                    >
                      {label === "Chart" ? <ChartLineIcon className="size-3.5" /> : <LockIcon className="size-3" />}
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Tile label="Price" value={usdPrice(token.price)} note={`${pct(token.change24h)} 24h`} tone={token.change24h < 0 ? "down" : "up"} />
              <Tile label="Market cap" value={usdShort(token.mcap)} />
              <Tile label="Volume 24h" value={usdShort(token.volume24h)} />
              <Tile label="Holders" value={compact(token.holders)} />
              <Tile label="Trades 24h" value={token.trades24h.toLocaleString("en-US")} />
              <Tile label="Creator fees" value={usdFees(token.fees)} note="earned so far" />
            </dl>
            <LiveStrip className="mt-3" />
          </div>
        </div>

        <div className="space-y-4">
          <div className={`${card} p-5`}>
            <div className="eyebrow">Fee split</div>
            <div className="mt-2 flex items-end gap-4">
              <div>
                <div className="text-3xl font-semibold tabular">80%</div>
                <div className="text-xs text-muted-foreground">to {creatorLabel(creator)}</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-muted-foreground tabular">20%</div>
                <div className="text-xs text-muted-foreground">protocol</div>
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-sm">
              <Line label="Owed to recipient" value={usd(book.owed * owedShare)} />
              <Line label="Received so far" value={usd(book.paid * owedShare)} />
              <Line label="Still accruing" value={usd(token.accruing)} />
              <Line label="Trade fee" value={`1% + ${token.creatorTax}% creator tax`} />
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Paid on</span>
                <span className="inline-flex items-center gap-1">
                  <PlatformGlyph platform={creator.platform} className="size-3.5" />
                  {PLATFORM_NAME[creator.platform]}, in dollars
                </span>
              </div>
            </div>
            <Link href={creatorPath(creator)} className={`${btn.outline} ${btn.md} mt-4 w-full`}>
              View {creatorLabel(creator)}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section className="min-w-0">
          <SectionHead title="Claims for this creator" />
          {claims.length ? <ClaimList claims={claims.slice(0, 8)} /> : <Empty title="No claims yet" body="A claim shows up here once fees are swept from escrow." />}
        </section>
        <section className="min-w-0">
          <SectionHead title="Payouts to this creator" />
          <PayoutList payouts={payouts.slice(0, 8)} />
        </section>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular">{value}</span>
    </div>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className={`${card} flex flex-col items-center justify-center p-8 text-center`}>
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{body}</div>
    </div>
  );
}
