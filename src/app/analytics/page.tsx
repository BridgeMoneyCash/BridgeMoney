import type { Metadata } from "next";
import Link from "next/link";
import { CLAIMS, DAILY, TOTALS } from "@/config/seed";
import { ClaimList, PreviewChip, SectionHead, StatCard } from "@/components/blocks";
import { BarChart, LineChart } from "@/components/charts";
import { BurnCard, LiveStrip } from "@/components/live/LiveStrip";
import { usd, usdShort } from "@/lib/format";
import { card } from "@/lib/ui";

export const metadata: Metadata = { title: "Analytics", description: "Creator fees, protocol revenue and launches across Bridge Money." };

const RANGES = [
  { key: "24h", label: "24h", days: 1 },
  { key: "7d", label: "7d", days: 7 },
  { key: "all", label: "All time", days: DAILY.fees.length },
] as const;

export default async function Analytics({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range: raw } = await searchParams;
  const range = RANGES.find((r) => r.key === raw) ?? RANGES[2];
  const from = DAILY.fees.length - range.days;
  const fees = DAILY.fees.slice(from);
  const launches = DAILY.launches.slice(from);
  const labels = DAILY.labels.slice(from);
  const windowFees = fees.reduce((a, b) => a + b, 0);
  // Revenue follows fees at the book's own claimed ratio, so the windows add up to the total.
  const revenue = range.key === "all" ? TOTALS.protocol : windowFees * (TOTALS.protocol / TOTALS.earned);
  const pct = (v: number) => `${Math.round((v / TOTALS.claimed) * 100)}%`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Protocol analytics</h1>
          <PreviewChip />
        </div>
        <div className="flex gap-1 text-xs text-muted-foreground">
          {RANGES.map((r) => (
            <Link
              key={r.key}
              href={r.key === "all" ? "/analytics" : `/analytics?range=${r.key}`}
              className={`rounded-full px-2.5 py-1 ${r.key === range.key ? "bg-foreground text-background" : "hover:text-foreground"}`}
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>

      <LiveStrip className={`${card} px-4 py-2.5`} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          size="text-4xl"
          label="Creator fees earned"
          value={usd(range.key === "all" ? TOTALS.earned : windowFees)}
          note="Everything creators earned: still accruing, claimed, credited and paid out, plus the protocol cut."
        />
        <StatCard size="text-4xl" label="Protocol revenue" value={usd(revenue)} note="20% of every claim, sent to the treasury." />
        <BurnCard />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className={`${card} p-5`}>
          <div className="text-sm text-muted-foreground">Fees</div>
          <div className="text-2xl font-semibold tabular">{usdShort(windowFees)}</div>
          <div className="mb-2 text-xs text-muted-foreground">Daily in UTC, creator share of trading fees.</div>
          {fees.length > 1 ? <LineChart values={fees} labels={labels} /> : <SingleDay value={usd(fees[0])} label={labels[0]} />}
        </div>
        <div className={`${card} p-5`}>
          <div className="text-sm text-muted-foreground">Token launches</div>
          <div className="text-2xl font-semibold tabular">{launches.reduce((a, b) => a + b, 0)}</div>
          <div className="mb-2 text-xs text-muted-foreground">Daily in UTC, launches that name a creator.</div>
          <BarChart values={launches} labels={labels} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard
          label="Paid to recipients (all time)"
          value={
            <>
              {usd(TOTALS.paid)} <span className="text-base font-normal text-muted-foreground">{pct(TOTALS.paid)}</span>
            </>
          }
          note="Creator shares already settled in dollars."
        />
        <StatCard
          label="Protocol cut (all time)"
          value={
            <>
              {usd(TOTALS.protocol)} <span className="text-base font-normal text-muted-foreground">20%</span>
            </>
          }
          note={`20% of ${usd(TOTALS.claimed)} claimed.`}
        />
        <StatCard
          label="Owed to recipients (all time)"
          value={
            <>
              {usd(TOTALS.owed)} <span className="text-base font-normal text-muted-foreground">{pct(TOTALS.owed)}</span>
            </>
          }
          note="Credited to creators and not yet withdrawn."
        />
      </div>

      <section>
        <SectionHead title="Claims" viewAll="/capital-flow">
          <span className="text-xs text-muted-foreground">80/20 split, applied per claim</span>
        </SectionHead>
        <ClaimList claims={CLAIMS.slice(0, 12)} />
      </section>
    </div>
  );
}

function SingleDay({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex h-[150px] flex-col items-center justify-center rounded-xl bg-muted/40 text-sm text-muted-foreground">
      <div className="text-lg font-semibold text-foreground tabular">{value}</div>
      {label}
    </div>
  );
}
