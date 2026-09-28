import type { Metadata } from "next";
import { BRAND, CHAIN, TOKEN, explorerAddress, shortAddress } from "@/config/brand";
import { CLAIMS, PAYOUTS, TOTALS } from "@/config/seed";
import { ClaimList, PayoutList, PreviewChip, SectionHead, StatCard } from "@/components/blocks";
import { ArrowDownIcon, ArrowRightIcon, BridgeIcon, ChartLineIcon, DollarIcon } from "@/components/icons";
import { LogoMark } from "@/components/Logo";
import { usd } from "@/lib/format";
import { card } from "@/lib/ui";

export const metadata: Metadata = { title: "Capital flow", description: "How a trading fee becomes a creator payout on Bridge Money." };

const STEPS = [
  {
    icon: <ChartLineIcon className="size-4" />,
    title: "Curve and pool",
    body: "Every trade pays a fee in the launch's pairing asset. The creator's part accrues on the bonding curve, then in the pool once the token graduates.",
  },
  {
    icon: <ArrowRightIcon className="size-4" />,
    title: "Fee escrow",
    body: "The launchpad sweeps those fees into escrow under the fee address the token named. Anyone can trigger the next step.",
  },
  {
    icon: <LogoMark className="size-4" />,
    title: "The bridge claims",
    body: "Bridge Money claims per creator and splits on the spot: 80% to the recipient, 20% to the treasury. Each claim is keyed to its own transaction.",
  },
  {
    icon: <ArrowDownIcon className="size-4" />,
    title: "Credited to the creator",
    body: "The recipient share sits in the creator's own fee address, and only the account the token named can move it.",
  },
  {
    icon: <DollarIcon className="size-4" />,
    title: "Settled in dollars",
    body: "The creator proves the account and withdraws USDG in one transaction, gas covered. Wallet recipients are paid straight to the address, no sign-in.",
  },
];

export default function CapitalFlow() {
  const addresses: [string, string | null, string][] = [
    ["Bridge Money fee router", null, "Published at launch"],
    [`${BRAND.symbol} token`, TOKEN.isLive ? BRAND.ca : null, "Published at launch"],
    ["Chainlink ETH / USD", CHAIN.ethUsdFeed, ""],
    ["Chain", null, `${CHAIN.name}, id ${CHAIN.id}`],
  ];
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Capital flow</h1>
          <PreviewChip />
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Creator fees on Robinhood Chain are claimed on a schedule, split 80/20 at that moment, and credited to the creator the token named on X, Spotify, Twitch, GitHub or
          a wallet. Account holders withdraw in dollars; wallet recipients are paid straight to their address.
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-9 hidden h-px overflow-hidden lg:block">
          <div className="animate-beam h-px w-1/4 bg-gradient-to-r from-transparent via-foreground/60 to-transparent" />
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          {STEPS.map((step) => (
            <div key={step.title} className="relative flex min-w-0 flex-col gap-2 rounded-2xl border border-border bg-card/60 p-4">
              <div className="flex size-9 items-center justify-center rounded-full bg-muted">{step.icon}</div>
              <div className="font-medium">{step.title}</div>
              <div className="text-sm text-muted-foreground">{step.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Claimed from escrow" value={usd(TOTALS.claimed)} note="on chain, at claim time" />
        <StatCard label="To recipients (80%)" value={usd(TOTALS.recipients)} note={`${usd(TOTALS.paid)} already paid out`} />
        <StatCard label="To treasury (20%)" value={usd(TOTALS.protocol)} note="kept by the protocol" />
      </div>

      <div className={`${card} p-5 text-sm`}>
        <div className="mb-2 flex items-center gap-2 font-medium">
          <BridgeIcon className="size-4" /> Addresses
        </div>
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {addresses.map(([label, address, fallback]) => (
            <div key={label} className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="truncate font-mono text-xs tabular">
                {address ? (
                  <a href={explorerAddress(address)} target="_blank" rel="noreferrer" className="hover:underline">
                    {shortAddress(address, 8, 6)}
                  </a>
                ) : (
                  <span className="text-muted-foreground">{fallback}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section className="min-w-0">
          <SectionHead title="Fee claims" pager="1 / 3" />
          <ClaimList claims={CLAIMS.slice(0, 14)} />
        </section>
        <section className="min-w-0">
          <SectionHead title="Payouts" pager="1 / 3" />
          <PayoutList payouts={PAYOUTS.slice(0, 14)} />
        </section>
      </div>
    </div>
  );
}
