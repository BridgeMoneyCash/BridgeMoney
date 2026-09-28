import { useId } from "react";
import type { Creator, Platform, Token } from "@/config/seed";
import { GithubIcon, SpotifyIcon, TwitchIcon, VerifiedIcon, WalletGlyph, XIcon } from "@/components/icons";

/*
 * Token art and creator avatars are drawn here from a seed, so the preview
 * needs no photos and no downloaded images. Same seed, same picture.
 */

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seq(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10_000) / 10_000;
  };
}

const PALETTES: [string, string, string][] = [
  ["#1b2a3a", "#6fa3c7", "#e8eef3"],
  ["#2a1d17", "#d08a4f", "#f3e6d6"],
  ["#1a2620", "#5fb58a", "#e3f1e8"],
  ["#231a2c", "#9c7ad6", "#ece4f7"],
  ["#2b1a1f", "#d0667a", "#f6e2e6"],
  ["#1f2326", "#a8b0b8", "#f2f3f5"],
  ["#262112", "#cdb14d", "#f5efd6"],
  ["#15252a", "#4fb7c4", "#dff3f5"],
];

/** Square token art: a sky, a horizon and a mark, composed from the token's seed. */
export function TokenArt({ token, className }: { token: Pick<Token, "ticker" | "art">; className?: string }) {
  const r = seq(hash(token.ticker) + token.art * 7919);
  const [deep, mid, light] = PALETTES[(hash(token.ticker) + token.art) % PALETTES.length];
  const kind = Math.floor(r() * 4);
  const cx = 30 + r() * 40;
  const cy = 26 + r() * 22;
  const size = 14 + r() * 14;
  const horizon = 62 + r() * 16;
  const id = `a${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={`${token.ticker} art`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor={mid} stopOpacity="0.85" />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
        <radialGradient id={`${id}g`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={light} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${id}s)`} />
      <circle cx={cx} cy={cy} r={size * 1.9} fill={`url(#${id}g)`} opacity="0.35" />
      {kind === 0 && <circle cx={cx} cy={cy} r={size} fill={light} opacity="0.92" />}
      {kind === 1 && (
        <path d={`M${cx - size} ${cy + size * 0.6} A ${size} ${size} 0 0 1 ${cx + size} ${cy + size * 0.6}`} fill="none" stroke={light} strokeWidth="5" strokeLinecap="round" />
      )}
      {kind === 2 && <rect x={cx - size * 0.8} y={cy - size * 0.8} width={size * 1.6} height={size * 1.6} rx={size * 0.35} fill={light} opacity="0.9" transform={`rotate(${r() * 40 - 20} ${cx} ${cy})`} />}
      {kind === 3 && (
        <g fill={light} opacity="0.9">
          {[0, 1, 2].map((k) => (
            <rect key={k} x={cx - size + k * size * 0.75} y={cy - size * (0.4 + k * 0.3)} width={size * 0.5} height={size * (0.8 + k * 0.6)} rx="2" />
          ))}
        </g>
      )}
      <path d={`M0 ${horizon} Q 25 ${horizon - 6 - r() * 8} 50 ${horizon} T 100 ${horizon - r() * 6} V100 H0 Z`} fill={deep} opacity="0.92" />
      <path d={`M0 ${horizon + 10} Q 30 ${horizon + 4} 60 ${horizon + 12} T 100 ${horizon + 8} V100 H0 Z`} fill="#000" opacity="0.35" />
      <text x="8" y="93" fontFamily="ui-monospace, monospace" fontSize="7" fontWeight="700" fill={light} opacity="0.7" letterSpacing="1">
        {token.ticker}
      </text>
    </svg>
  );
}

/** Creator avatar: initials over a soft gradient in the creator's hue. */
export function Avatar({ creator, className }: { creator: Pick<Creator, "name" | "hue">; className?: string }) {
  const initials = creator.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const id = `v${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const h = creator.hue;
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={creator.name}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${h} 38% 46%)`} />
          <stop offset="1" stopColor={`hsl(${(h + 40) % 360} 30% 16%)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${id})`} />
      <circle cx="78" cy="18" r="30" fill="#fff" opacity="0.08" />
      <text x="50" y="50" dy="0.36em" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="38" fontWeight="600" fill="#fff" opacity="0.92">
        {initials}
      </text>
    </svg>
  );
}

/** Token art with the creator's avatar tucked into the corner. */
export function TokenThumb({
  token,
  creator,
  className = "size-12 rounded-xl",
  badge = "size-5 -right-1 -bottom-1",
}: {
  token: Token;
  creator: Creator;
  className?: string;
  badge?: string;
}) {
  return (
    <div className="relative shrink-0">
      <TokenArt token={token} className={`block overflow-hidden bg-muted ${className}`} />
      <div className={`absolute overflow-hidden rounded-full border-2 border-background bg-background ${badge}`}>
        <Avatar creator={creator} className="block size-full" />
      </div>
    </div>
  );
}

const PLATFORM_TINT: Record<Platform, string> = {
  x: "text-white",
  spotify: "text-[#1ed760]",
  twitch: "text-[#a970ff]",
  github: "text-white",
  wallet: "text-[#f5c451]",
};

export function PlatformGlyph({ platform, className = "size-3", tinted = false }: { platform: Platform; className?: string; tinted?: boolean }) {
  const cls = `${className} ${tinted ? PLATFORM_TINT[platform] : ""} shrink-0`;
  switch (platform) {
    case "x":
      return <XIcon className={cls} />;
    case "spotify":
      return <SpotifyIcon className={cls} />;
    case "twitch":
      return <TwitchIcon className={cls} />;
    case "github":
      return <GithubIcon className={cls} />;
    case "wallet":
      return <WalletGlyph className={cls} />;
  }
}

export function Verified({ className = "size-3" }: { className?: string }) {
  return <VerifiedIcon className={`${className} shrink-0`} />;
}
