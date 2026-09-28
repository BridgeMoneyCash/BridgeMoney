import type { Metadata } from "next";
import Link from "next/link";
import { CLAIMS, CREATORS, PAYOUTS, PLATFORM_NAME, bookById, creatorByRoute, creatorExternal, creatorLabel, type Creator, type Platform } from "@/config/seed";
import { ClaimList, PayoutList, PreviewChip, SectionHead, TokenGrid } from "@/components/blocks";
import { ExternalIcon } from "@/components/icons";
import { Avatar, PlatformGlyph, Verified } from "@/components/ui/Art";
import { usd } from "@/lib/format";
import { btn, card } from "@/lib/ui";

/* One profile page for every platform route: /x, /spotify/artist, /twitch, /github, /wallet. */

export function creatorParams(platform: Platform) {
  return CREATORS.filter((c) => c.platform === platform).map((c) => c.handle);
}

export function creatorMetadata(platform: Platform, handle: string): Metadata {
  const creator = creatorByRoute(platform, decodeURIComponent(handle));
  const label = creator ? creatorLabel(creator) : `@${decodeURIComponent(handle)}`;
  return { title: `${label} on ${PLATFORM_NAME[platform]}`, description: `Launches that pay ${label} through Bridge Money, and what has been paid so far.` };
}

export function CreatorProfile({ platform, handle }: { platform: Platform; handle: string }) {
  const clean = decodeURIComponent(handle).replace(/^@/, "");
  const found = creatorByRoute(platform, clean);
  // An account nobody has named yet still gets a page: it is where a launch for it starts.
  const creator: Creator = found ?? { id: "", platform, handle: clean, name: platform === "spotify" ? "Spotify artist" : clean, verified: false, hue: 220, paidRatio: 0 };
  const book = found ? bookById(found.id) : null;
  const claims = found ? CLAIMS.filter((c) => c.creatorId === found.id) : [];
  const payouts = found ? PAYOUTS.filter((p) => p.creatorId === found.id) : [];
  const external = found ? creatorExternal(found) : null;
  const label = creatorLabel(creator);

  const tiles: [string, string, string][] = [
    ["Owed, ready to pay", usd(book?.owed ?? 0), "credited to the account"],
    ["Claimed, settling", usd(0), "collected on payout"],
    ["Still accruing", usd(book?.accruing ?? 0), "swept about hourly"],
    ["Paid out", usd(book?.paid ?? 0), "in dollars, to the account"],
  ];

  return (
    <div className="space-y-8">
      <div className={`${card} relative overflow-hidden p-6`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(255_255_255/8%),transparent_50%)]" />
        <div className="relative flex flex-wrap items-center gap-5">
          <div className="flex min-w-0 flex-1 basis-64 items-center gap-5">
            <Avatar creator={creator} className="size-20 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-2xl font-semibold tracking-tight">{creator.name}</h1>
                {creator.verified && <Verified className="size-5" />}
                {found && <PreviewChip />}
              </div>
              {external ? (
                <a href={external} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <PlatformGlyph platform={platform} className="size-3.5" /> {label} <ExternalIcon className="size-3" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <PlatformGlyph platform={platform} className="size-3.5" /> {platform === "spotify" ? `artist ${creator.handle.slice(0, 8)}…` : label}
                </span>
              )}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm tabular">
                <span>
                  <span className="font-semibold">{book?.tokens.length ?? 0}</span> <span className="text-muted-foreground">tokens</span>
                </span>
                <span>
                  <span className="font-semibold">{usd(book?.paid ?? 0)}</span> <span className="text-muted-foreground">received</span>
                </span>
                <span>
                  <span className="font-semibold">{usd(book?.owed ?? 0)}</span> <span className="text-muted-foreground">owed</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto">
            <Link href="/launch" className={`${btn.primary} ${btn.md}`}>
              Launch for {label}
            </Link>
          </div>
        </div>
        <dl className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map(([title, value, note]) => (
            <div key={title} className="min-w-0 rounded-xl bg-muted/50 px-3 py-2.5">
              <dt className="truncate text-xs text-muted-foreground">{title}</dt>
              <dd className="font-semibold tabular">{value}</dd>
              <dd className="truncate text-xs text-muted-foreground tabular">{note}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section>
        <SectionHead title={`Tokens paying ${label}`} />
        {book && book.tokens.length ? (
          <TokenGrid tokens={book.tokens} wide />
        ) : (
          <div className={`${card} p-8 text-center`}>
            <div className="font-medium">No launch names this account yet</div>
            <div className="mt-1 text-sm text-muted-foreground">Launch a token with its fees routed here and the share starts accruing from the first trade.</div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section className="min-w-0">
          <SectionHead title="Payouts" />
          <PayoutList payouts={payouts.slice(0, 10)} />
        </section>
        <section className="min-w-0">
          <SectionHead title="Claims" />
          {claims.length ? (
            <ClaimList claims={claims.slice(0, 10)} />
          ) : (
            <div className={`${card} p-8 text-center`}>
              <div className="font-medium">No claims yet</div>
              <div className="mt-1 text-sm text-muted-foreground">Claims appear here as fees are swept from escrow.</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
