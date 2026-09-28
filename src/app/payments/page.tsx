import type { Metadata } from "next";
import Link from "next/link";
import { CLAIMS, PAYOUTS, TOTALS, creatorById, topTokens, type Platform } from "@/config/seed";
import { ClaimList, PayoutList, PreviewChip, SectionHead } from "@/components/blocks";
import { Avatar, PlatformGlyph, TokenArt } from "@/components/ui/Art";
import { usd } from "@/lib/format";
import { card } from "@/lib/ui";

export const metadata: Metadata = { title: "Payments", description: "Creator shares paid out in dollars, and the claims they came from." };

const FILTERS = [
  { min: 0, label: "All" },
  { min: 100, label: "$100+" },
  { min: 500, label: "$500+" },
];
const PLATFORMS: Platform[] = ["x", "spotify", "twitch", "github", "wallet"];

export default async function Payments({ searchParams }: { searchParams: Promise<{ min?: string }> }) {
  const { min: raw } = await searchParams;
  const min = FILTERS.some((f) => String(f.min) === raw) ? Number(raw) : 0;
  const payouts = PAYOUTS.filter((p) => p.amount >= min);

  return (
    <div className="space-y-8">
      <div className={`${card} relative overflow-hidden p-6`}>
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_right,rgb(255_255_255/8%),transparent_60%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {PLATFORMS.map((p) => (
                <PlatformGlyph key={p} platform={p} tinted className="size-3.5" />
              ))}
              Paid to creators
            </div>
            <div className="mt-1 text-5xl font-semibold tabular">{usd(TOTALS.paid)}</div>
            <div className="text-sm text-muted-foreground">Total settled in dollars</div>
          </div>
          <div className="flex gap-1 text-xs">
            <span className="rounded-full bg-foreground px-3 py-1.5 text-background">Creators</span>
            <Link href="/capital-flow" className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground">
              Treasury
            </Link>
          </div>
        </div>
        <div className="relative mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <div className="text-xs text-muted-foreground">Ready to send</div>
            <div className="font-semibold tabular">{usd(TOTALS.owed)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Still accruing</div>
            <div className="font-semibold tabular">{usd(TOTALS.accruing)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Launches paying out</div>
            <div className="font-semibold tabular">{TOTALS.launches}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem]">
        <section className="min-w-0">
          <SectionHead title="Recent payments" pager={`1 / ${Math.max(1, Math.ceil(payouts.length / 12))}`}>
            <div className="flex flex-wrap gap-1">
              {FILTERS.map((f) => (
                <Link
                  key={f.label}
                  href={f.min ? `/payments?min=${f.min}` : "/payments"}
                  className={`rounded-full px-2.5 py-1 text-xs ${min === f.min ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
            <PreviewChip />
          </SectionHead>
          <PayoutList payouts={payouts.slice(0, 12)} />
        </section>
        <aside className="min-w-0 space-y-8">
          <div>
            <SectionHead title="Top earning tokens" viewAll="/explore" />
            <ul className="space-y-2">
              {topTokens()
                .slice(0, 8)
                .map((t) => {
                  const creator = creatorById(t.creatorId);
                  return (
                    <li key={t.address}>
                      <Link href={`/token/${t.address}`} className="flex items-center gap-2 rounded-2xl border border-border bg-card/60 px-3 py-2.5 hover:border-foreground/25">
                        <TokenArt token={t} className="size-9 shrink-0 rounded-lg bg-muted" />
                        <Avatar creator={creator} className="size-8 shrink-0 rounded-full" />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{t.ticker}</div>
                          <div className="truncate text-xs text-muted-foreground">{creator.name}</div>
                        </div>
                        <div className="ml-auto shrink-0 text-right">
                          <div className="font-semibold tabular">{usd(t.fees)}</div>
                          <div className="text-xs text-muted-foreground tabular">{t.accruing ? `${usd(t.accruing)} accruing` : "fees"}</div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        </aside>
      </div>

      <section>
        <SectionHead title="Fee claims" viewAll="/capital-flow" />
        <ClaimList claims={CLAIMS.slice(0, 8)} />
        <p className="mt-2 text-xs text-muted-foreground">Latest claim {CLAIMS[0].minutesAgo}m before the preview book was written.</p>
      </section>
    </div>
  );
}
