import type { Metadata } from "next";
import Link from "next/link";
import { CREATORS, PLATFORM_NAME, TOKENS, creatorById, topTokens, type Platform } from "@/config/seed";
import { Marquee, PreviewChip, SectionHead, TokenGrid } from "@/components/blocks";
import { PlatformGlyph, TokenThumb } from "@/components/ui/Art";
import { usd } from "@/lib/format";
import { btn } from "@/lib/ui";

export const metadata: Metadata = { title: "Explore", description: "Every launch that routes its creator fees through Bridge Money." };

const SORTS = [
  { key: "fees", label: "Fees" },
  { key: "mcap", label: "Market cap" },
  { key: "recent", label: "Recent" },
] as const;
const PLATFORMS: Platform[] = ["x", "spotify", "twitch", "github", "wallet"];

type Search = { sort?: string; platform?: string; q?: string };

function href(current: Search, patch: Search) {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  if (next.sort && next.sort !== "fees") params.set("sort", next.sort);
  if (next.platform) params.set("platform", next.platform);
  if (next.q) params.set("q", next.q);
  const s = params.toString();
  return s ? `/explore?${s}` : "/explore";
}

export default async function Explore({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const sort = SORTS.some((s) => s.key === sp.sort) ? sp.sort! : "fees";
  const platform = PLATFORMS.includes(sp.platform as Platform) ? (sp.platform as Platform) : undefined;
  const q = (sp.q ?? "").trim().toLowerCase().replace(/^[@$]/, "");

  let list = [...TOKENS];
  if (platform) list = list.filter((t) => creatorById(t.creatorId).platform === platform);
  if (q) {
    const creatorIds = new Set(CREATORS.filter((c) => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q)).map((c) => c.id));
    list = list.filter((t) => t.name.toLowerCase().includes(q) || t.ticker.toLowerCase().includes(q) || creatorIds.has(t.creatorId));
  }
  list.sort((a, b) => (sort === "mcap" ? b.mcap - a.mcap : sort === "recent" ? Date.parse(b.launchedAt) - Date.parse(a.launchedAt) : b.fees - a.fees));

  const current: Search = { sort, platform, q: sp.q };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-border bg-card/40 p-6">
        <div className="max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight">Explore launches</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tokens on Robinhood Chain that route their creator fees through Bridge Money. Each one pays, in dollars, the creator it names on X, Spotify, Twitch, GitHub or a
            wallet.
          </p>
        </div>
        <Link href="/launch" className={`${btn.primary} ${btn.md}`}>
          Launch a token
        </Link>
      </div>

      <section>
        <SectionHead title="Trending" />
        <Marquee seconds={50}>
          {topTokens()
            .slice(0, 10)
            .map((t) => (
              <Link
                key={t.address}
                href={`/token/${t.address}`}
                className="flex w-56 shrink-0 items-center gap-3 rounded-2xl border border-border bg-card/60 p-3 hover:border-foreground/25"
              >
                <TokenThumb token={t} creator={creatorById(t.creatorId)} />
                <div className="min-w-0 text-sm">
                  <div className="truncate font-medium">
                    {t.name} <span className="text-muted-foreground">{t.ticker}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Fees</div>
                  <div className="font-semibold tabular">{usd(t.fees)}</div>
                </div>
              </Link>
            ))}
        </Marquee>
      </section>

      <section>
        <SectionHead title="All launches">
          <PreviewChip />
          <form action="/explore" className="flex w-full gap-2 sm:ml-auto sm:w-auto">
            {sort !== "fees" && <input type="hidden" name="sort" value={sort} />}
            {platform && <input type="hidden" name="platform" value={platform} />}
            <input
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="Filter by name, ticker or creator"
              className="h-9 w-full min-w-0 rounded-full border border-border bg-card px-3 text-sm outline-none focus:border-foreground/40 sm:w-64"
            />
          </form>
        </SectionHead>
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex flex-wrap gap-1.5" aria-label="Sort">
            {SORTS.map((s) => (
              <Link
                key={s.key}
                href={href(current, { sort: s.key })}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  sort === s.key ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 sm:ml-auto" aria-label="Platform">
            <Link
              href={href(current, { platform: undefined })}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                !platform ? "border-white/30 bg-white/[0.08] text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </Link>
            {PLATFORMS.map((p) => (
              <Link
                key={p}
                href={href(current, { platform: p })}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
                  platform === p ? "border-white/30 bg-white/[0.08] text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <PlatformGlyph platform={p} tinted={platform === p} />
                {PLATFORM_NAME[p]}
              </Link>
            ))}
          </div>
        </div>
        {list.length ? (
          <TokenGrid tokens={list} wide />
        ) : (
          <div className="rounded-2xl border border-border bg-card/60 p-10 text-center text-sm text-muted-foreground">No launch matches this filter.</div>
        )}
      </section>
    </div>
  );
}
