import Link from "next/link";
import { BRAND } from "@/config/brand";
import {
  CLAIMS,
  CREATOR_BOOK,
  DAILY,
  PAYOUTS,
  PLATFORM_NAME,
  TOTALS,
  creatorLabel,
  creatorPath,
  mostPaid,
  recentTokens,
  topCreators,
  topTokens,
  type Platform,
} from "@/config/seed";
import { LogoMark } from "@/components/Logo";
import { ArrowRightIcon, SparkleIcon } from "@/components/icons";
import { Avatar, PlatformGlyph, TokenArt, Verified } from "@/components/ui/Art";
import { ClaimList, CreatorName, Marquee, PayoutList, PreviewChip, SectionHead, TickerCard, TokenGrid } from "@/components/blocks";
import { CreatorStage, type StageEntry } from "@/components/home/CreatorStage";
import { Sparkline } from "@/components/charts";
import { usd } from "@/lib/format";
import { btn, card } from "@/lib/ui";

const PLATFORMS: Platform[] = ["x", "spotify", "twitch", "github", "wallet"];

function stageEntries(): StageEntry[] {
  // The best-paid creator on each platform, one card per platform.
  return PLATFORMS.map((platform) => {
    const book = [...CREATOR_BOOK].filter((b) => b.creator.platform === platform).sort((a, b) => b.paid - a.paid)[0];
    return {
      creator: book.creator,
      label: creatorLabel(book.creator),
      href: creatorPath(book.creator),
      platform: PLATFORM_NAME[platform],
      sent: usd(Math.floor(book.paid / 10) * 10),
    };
  });
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-border/80 bg-[radial-gradient(ellipse_at_top_left,rgb(255_255_255/6%),transparent_55%)] px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10" />
      <SparkleIcon className="absolute top-4 left-4 size-4 text-white opacity-80" />
      <SparkleIcon className="absolute top-4 right-4 size-4 text-white opacity-80" />
      <SparkleIcon className="absolute bottom-4 left-4 size-4 text-white opacity-50" />
      <SparkleIcon className="absolute right-4 bottom-4 size-4 text-white opacity-50" />
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr] xl:grid-cols-[1fr_1.4fr]">
        <div className="min-w-0">
          <div className="rise flex items-center gap-2">
            <LogoMark className="size-8" />
            <span className="text-sm font-semibold tracking-[0.28em] uppercase">{BRAND.wordmark}</span>
          </div>
          <h1 className="rise mt-8 text-5xl leading-[0.98] font-semibold tracking-[-0.03em] text-balance sm:text-6xl xl:text-7xl" style={{ animationDelay: "80ms" }}>
            <span className="block text-white">Creator fees.</span>
            <span className="chrome-text block">Bridged home.</span>
          </h1>
          <p className="eyebrow rise mt-7 max-w-sm leading-relaxed" style={{ animationDelay: "160ms" }}>
            <span className="block">The infrastructure of</span>
            <span className="block">programmable money.</span>
          </p>
          <div className="mt-4 h-px w-10 bg-white/40" />
          <p className="rise mt-6 max-w-md text-base text-muted-foreground" style={{ animationDelay: "220ms" }}>
            Route a token&apos;s creator fees to anyone on <PlatformGlyph platform="x" className="inline size-3.5 align-[-2px] text-white" />,{" "}
            <PlatformGlyph platform="spotify" tinted className="inline size-3.5 align-[-2px]" />,{" "}
            <PlatformGlyph platform="twitch" tinted className="inline size-3.5 align-[-2px]" />,{" "}
            <PlatformGlyph platform="github" className="inline size-3.5 align-[-2px] text-white" /> or a{" "}
            <PlatformGlyph platform="wallet" tinted className="inline size-3.5 align-[-2px]" /> wallet, and the share settles in dollars. Every token launches on{" "}
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-sm text-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              Robinhood Chain
            </span>
            .
          </p>
          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "280ms" }}>
            <Link href="/launch" className={`${btn.primary} ${btn.lg}`}>
              Launch a token
            </Link>
            <Link href="/docs" className={`${btn.outline} ${btn.lg}`}>
              Read the docs <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>
        <div className="creator-stage-wrap rise relative -mx-6 min-w-0 sm:-mx-10 lg:mx-0" style={{ animationDelay: "200ms" }}>
          <CreatorStage entries={stageEntries()} />
        </div>
      </div>
    </section>
  );
}

function BentoCard({ href, title, className = "", children }: { href: string; title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`rise ${className}`}>
      <Link
        href={href}
        className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card/60 p-4 transition-all hover:-translate-y-0.5 hover:border-foreground/25"
      >
        <div className="min-h-0 flex-1">{children}</div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-medium">{title}</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground group-hover:text-foreground">
            Open <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </div>
  );
}

function Bento() {
  const arts = topTokens().slice(0, 6);
  const cumulative = DAILY.fees.reduce<number[]>((acc, v) => [...acc, (acc.at(-1) ?? 0) + v], []);
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      <BentoCard href="/explore" title="Explore">
        <div className="grid grid-cols-3 content-start gap-2">
          {arts.map((t, i) => (
            <div key={t.address} className="animate-float aspect-square w-full min-w-0 overflow-hidden rounded-xl bg-muted" style={{ animationDelay: `${i * 0.4}s` }}>
              <TokenArt token={t} className="block size-full" />
            </div>
          ))}
        </div>
      </BentoCard>
      <BentoCard href="/payments" title="Payments">
        <ul className="space-y-2">
          {PAYOUTS.slice(0, 3).map((p) => {
            const book = CREATOR_BOOK.find((b) => b.creator.id === p.creatorId)!;
            return (
              <li key={p.id} className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-semibold tabular">{usd(p.amount)}</div>
                  <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                    <span className="shrink-0">sent to</span>
                    <PlatformGlyph platform={book.creator.platform} />
                    <span className="truncate text-foreground">{book.creator.name}</span>
                  </div>
                </div>
                <Avatar creator={book.creator} className="size-8 rounded-full" />
              </li>
            );
          })}
        </ul>
      </BentoCard>
      <BentoCard href="/analytics" title="Analytics">
        <div className="text-xs text-muted-foreground">Creator fees, all time</div>
        <div className="text-3xl font-semibold tabular">{usd(TOTALS.earned)}</div>
        <Sparkline values={cumulative} className="mt-2 h-14 w-full" />
      </BentoCard>
      <BentoCard href="/launch" title="Launch">
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="text-[10px] tracking-wider text-muted-foreground uppercase">Routing to</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex -space-x-1.5">
              {PLATFORMS.map((p) => (
                <span key={p} className="flex size-7 items-center justify-center rounded-full border border-background bg-muted">
                  <PlatformGlyph platform={p} tinted className="size-3.5" />
                </span>
              ))}
            </span>
            <div className="min-w-0 text-sm">
              <div className="font-medium">@anyhandle</div>
              <div className="truncate text-xs text-muted-foreground">Fees to @anyhandle via Bridge Money</div>
            </div>
          </div>
          <div className="mt-3 text-2xl font-semibold tabular">80%</div>
          <div className="text-xs text-success">of every claim, settled to the creator in dollars</div>
        </div>
      </BentoCard>
      <BentoCard href="/docs" title="Docs" className="md:col-span-2 xl:col-span-2">
        <div className="text-xs text-muted-foreground">How it works</div>
        <ol className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            ["Name a creator", "Launch on Robinhood Chain and set the fee line to an account on X, Spotify, Twitch, GitHub or a wallet. Nobody has to sign up first."],
            ["The bridge claims", "Fees are collected on a schedule and split on chain in one step: 80% to the creator, 20% to the protocol."],
            ["Settled in dollars", "The creator proves the account and withdraws the share as USDG. Gas is covered by the protocol."],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-2.5 rounded-xl bg-muted/60 px-3 py-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">{i + 1}</span>
              <span className="min-w-0 text-sm">
                <span className="block font-medium">{title}</span>
                <span className="block text-xs text-muted-foreground">{body}</span>
              </span>
            </li>
          ))}
        </ol>
      </BentoCard>
    </div>
  );
}

export default function Home() {
  const creators = topCreators().slice(0, 5);
  const paid = mostPaid().slice(0, 6);
  return (
    <div className="space-y-10">
      <Hero />

      <Marquee seconds={60}>
        {recentTokens()
          .slice(0, 12)
          .map((t) => (
            <TickerCard key={t.address} token={t} />
          ))}
      </Marquee>

      <Bento />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_20rem] xl:grid-cols-[1fr_22rem]">
        <section className="min-w-0">
          <SectionHead title="Top tokens" pager="1 / 2" viewAll="/explore">
            <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">Robinhood Chain</span>
            <PreviewChip />
          </SectionHead>
          <TokenGrid tokens={topTokens().slice(0, 12)} />
        </section>
        <aside className="min-w-0">
          <SectionHead title="Top creators" pager="1 / 3" />
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {creators.map((b) => (
              <li key={b.creator.id}>
                <Link href={creatorPath(b.creator)} className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card/60 p-3 transition-colors hover:border-foreground/25">
                  <Avatar creator={b.creator} className="size-14 shrink-0 rounded-2xl" />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1">
                      <span className="truncate font-semibold">{b.creator.name}</span>
                      {b.creator.verified && <Verified className="size-4" />}
                    </div>
                    <div className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
                      <PlatformGlyph platform={b.creator.platform} />
                      <span className="truncate">{creatorLabel(b.creator)}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 text-xs tabular">
                      <span>
                        <span className="font-semibold">{b.tokens.length}</span> <span className="text-muted-foreground">{b.tokens.length === 1 ? "Token" : "Tokens"}</span>
                      </span>
                      <span>
                        <span className="font-semibold">{usd(b.fees)}</span> <span className="text-muted-foreground">Fees</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_20rem] xl:grid-cols-[1fr_22rem]">
        <section className="min-w-0">
          <SectionHead title="Recent payments" pager="1 / 6" viewAll="/payments">
            <PreviewChip />
          </SectionHead>
          <PayoutList payouts={PAYOUTS.slice(0, 6)} />
        </section>
        <aside className="min-w-0">
          <SectionHead title="Most paid" pager="1 / 2" />
          <ul className="space-y-2">
            {paid.map((b) => (
              <li key={b.creator.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card/60 px-3 py-2.5">
                <div className="flex items-center -space-x-2">
                  <div className="relative shrink-0 rounded-lg border-2 border-background">
                    <TokenArt token={b.tokens[0]} className="block size-9 rounded-lg bg-muted" />
                  </div>
                  <Avatar creator={b.creator} className="size-9 rounded-full border-2 border-background" />
                </div>
                <Link href={creatorPath(b.creator)} className="flex min-w-0 flex-1 items-center gap-1.5 text-sm hover:underline">
                  <CreatorName creator={b.creator} />
                </Link>
                <div className="text-lg font-semibold tabular">{usd(b.paid)}</div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section className="min-w-0">
          <SectionHead title="Claims" pager="1 / 7" viewAll="/capital-flow">
            <PreviewChip />
          </SectionHead>
          <ClaimList claims={CLAIMS.slice(0, 6)} />
        </section>
        <section className="min-w-0">
          <SectionHead title="Getting paid" />
          <div className={`${card} p-5`}>
            <p className="text-sm text-muted-foreground">
              Did a token name your account? Then its share is already set aside for you. On X, Spotify, Twitch or GitHub you prove the account and withdraw in dollars. A
              wallet recipient is paid straight to that address. There is no app to install and nothing to approve in advance.
            </p>
            <Link href="/docs#getting-paid" className={`${btn.outline} ${btn.sm} mt-4`}>
              How payouts work
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
