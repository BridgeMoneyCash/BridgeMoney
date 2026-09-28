/*
 * Launch preview data. Until the fee router is deployed the site shows this
 * fixed book instead of an indexer: 24 launches by 14 fictional creators.
 *
 * The launches below are the whole population, so every headline figure is a
 * sum over them. Claims and payouts are recent samples of that book, and each
 * sample is checked against the totals it belongs to (see assertBook).
 */

export type Platform = "x" | "spotify" | "twitch" | "github" | "wallet";

export type Creator = {
  id: string;
  platform: Platform;
  /** Handle on the platform; for a Spotify artist, the artist id. */
  handle: string;
  name: string;
  verified: boolean;
  hue: number;
  /** Share of the credited balance already paid out, 0..1. */
  paidRatio: number;
};

export type Token = {
  address: string;
  name: string;
  ticker: string;
  creatorId: string;
  description: string;
  launchedAt: string;
  graduated: boolean;
  mcap: number;
  fees: number;
  accruing: number;
  price: number;
  change24h: number;
  volume24h: number;
  holders: number;
  trades24h: number;
  creatorTax: number;
  art: number;
};

export type Claim = { id: string; tokenAddress: string; creatorId: string; amount: number; minutesAgo: number };
export type Payout = { id: string; tokenAddress: string; creatorId: string; amount: number; minutesAgo: number };

/** The moment the preview book was written. Ages are measured from here. */
export const BOOK_TIME = Date.UTC(2026, 8, 28, 12, 0, 0);
const DAY = 86_400_000;

/* Small deterministic generator so the book is identical on every build. */
function prng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = prng(4663);
const between = (a: number, b: number) => a + (b - a) * rand();
const cents = (v: number) => Math.round(v * 100) / 100;

function hex(len: number) {
  let out = "";
  for (let i = 0; i < len; i++) out += Math.floor(rand() * 16).toString(16);
  return out;
}
function base62(len: number) {
  const abc = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < len; i++) out += abc[Math.floor(rand() * abc.length)];
  return out;
}

const CREATOR_ROWS: [Platform, string, string, boolean, number, number][] = [
  // platform, handle, display name, verified, hue, paid ratio
  ["x", "bridgemoneycash", "Bridge Money", true, 210, 0.62],
  ["x", "miracastell", "Mira Castell", true, 18, 0.48],
  ["spotify", "", "Juniper Hale", false, 150, 0.41],
  ["twitch", "kestrelplays", "Kestrel", false, 268, 0.55],
  ["github", "ledgerwright", "ledgerwright", false, 96, 0.37],
  ["wallet", "pimokafor", "Pim Okafor", false, 40, 0.7],
  ["x", "theovance", "Theo Vance", false, 330, 0.22],
  ["x", "solferreira", "Sol Ferreira", true, 190, 0.3],
  ["spotify", "", "Orbit Lane", false, 250, 0.18],
  ["twitch", "nadiarowe", "Nadia Rowe", false, 300, 0.26],
  ["github", "quietcompiler", "quietcompiler", false, 120, 0],
  ["wallet", "aritanaka", "Ari Tanaka", false, 60, 0.52],
  ["x", "wrenmbeki", "Wren Mbeki", false, 0, 0.12],
  ["x", "hollisgrant", "Hollis Grant", false, 225, 0],
];

export const CREATORS: Creator[] = CREATOR_ROWS.map(([platform, handle, name, verified, hue, paidRatio], i) => ({
  id: `c${i + 1}`,
  platform,
  handle: platform === "spotify" ? base62(22) : handle,
  name,
  verified,
  hue,
  paidRatio,
}));

const TOKEN_ROWS: [string, string, number, string][] = [
  // name, ticker, creator index, description
  ["Bridge Relay", "RELAY", 0, "Every trade routes a fee to the team that builds the rails."],
  ["Harbor Light", "HARBOR", 1, "A lighthouse for late-night traders. Fees keep the lamp lit."],
  ["Night Market", "NIGHT", 2, "Named after the record, launched for the artist behind it."],
  ["Speedrun", "RUN", 3, "Frame-perfect chat token for the fastest stream on the chain."],
  ["Merge Queen", "MERGE", 4, "For the maintainer who reviews everything by Monday."],
  ["Okafor Fund", "OKA", 5, "A community tip jar that pays straight to one wallet."],
  ["Signal Frog", "SIGFROG", 6, "The frog only croaks when the chart turns green."],
  ["Tidal", "TIDE", 7, "Slow in, slow out. Fees go to the account that named it."],
  ["Afterglow", "GLOW", 8, "Late set, long tail. Every fee lands with the artist."],
  ["Rally Point", "RALLY", 9, "Where the raid meets up. Built for one channel."],
  ["Silent Build", "SILENT", 10, "Ships quietly. Pays the org account that ships it."],
  ["Lantern", "LANTERN", 11, "Carry a small light. Fees pushed to the wallet that lit it."],
  ["Wren Song", "WREN", 12, "Short songs, long holders."],
  ["Keystone", "KEY", 13, "The stone at the top of the arch holds the rest in place."],
  ["Copper Kite", "KITE", 1, "Flies on any wind, pays on any trade."],
  ["Soft Launch", "SOFT", 6, "No roadmap. Just the fee line and a good name."],
  ["Encore", "ENCORE", 2, "One more song, one more claim."],
  ["Stack Trace", "TRACE", 4, "Every error has an owner, and so does this token."],
  ["Blue Hour", "BLUE", 7, "Launched at dusk, traded until dawn."],
  ["Night Owl", "OWL", 11, "Awake when the chain is quiet."],
  ["Parade", "PARADE", 12, "Loud, colourful, and over too soon."],
  ["Grant Street", "GRANT", 13, "A corner token for a corner of the timeline."],
  ["Paper Moon", "PMOON", 8, "Cut from paper, priced in ETH."],
  ["Checkpoint", "SAVE", 3, "Save your progress. Fees save for the streamer."],
];

// Launch days, newest last, spread over the eleven days of the book.
const LAUNCH_DAYS_AGO = [10, 9, 9, 8, 8, 7, 7, 6, 6, 5, 5, 5, 4, 4, 3, 3, 3, 2, 2, 1, 1, 1, 0, 0];

export const TOKENS: Token[] = TOKEN_ROWS.map(([name, ticker, creatorIndex, description], i) => {
  const fees = cents(26_400 * Math.pow(0.8, i) + between(40, 320));
  const multiple = between(2.4, 9.5);
  const mcap = Math.round(fees * multiple + between(3_800, 5_200));
  const accruing = i % 3 === 2 ? 0 : cents(fees * between(0.0015, 0.008));
  const launchedAt = new Date(BOOK_TIME - LAUNCH_DAYS_AGO[i] * DAY - Math.floor(between(1, 20)) * 3_600_000).toISOString();
  return {
    address: `0x${hex(40)}`,
    name,
    ticker,
    creatorId: `c${creatorIndex + 1}`,
    description,
    launchedAt,
    graduated: mcap > 25_000,
    mcap,
    fees,
    accruing,
    price: mcap / 1_000_000_000,
    change24h: cents(between(-28, 42)),
    volume24h: Math.round(mcap * between(0.04, 0.5)),
    holders: Math.round(mcap / between(18, 42)),
    trades24h: Math.round(between(40, 900) * (1 + mcap / 60_000)),
    creatorTax: i % 4 === 0 ? 2 : i % 5 === 0 ? 1 : 0,
    art: i,
  };
});

export const SPLIT_RECIPIENT = 0.8;

const claimedOf = (t: Token) => t.fees - t.accruing;

export type CreatorBook = {
  creator: Creator;
  tokens: Token[];
  fees: number;
  accruing: number;
  credited: number;
  paid: number;
  owed: number;
};

export const CREATOR_BOOK: CreatorBook[] = CREATORS.map((creator) => {
  const tokens = TOKENS.filter((t) => t.creatorId === creator.id);
  const fees = tokens.reduce((s, t) => s + t.fees, 0);
  const accruing = tokens.reduce((s, t) => s + t.accruing, 0);
  const credited = cents(tokens.reduce((s, t) => s + claimedOf(t), 0) * SPLIT_RECIPIENT);
  const paid = cents(credited * creator.paidRatio);
  return { creator, tokens, fees: cents(fees), accruing: cents(accruing), credited, paid, owed: cents(credited - paid) };
});

export const TOTALS = (() => {
  const earned = TOKENS.reduce((s, t) => s + t.fees, 0);
  const accruing = TOKENS.reduce((s, t) => s + t.accruing, 0);
  const claimed = earned - accruing;
  const recipients = CREATOR_BOOK.reduce((s, b) => s + b.credited, 0);
  const paid = CREATOR_BOOK.reduce((s, b) => s + b.paid, 0);
  return {
    earned: cents(earned),
    accruing: cents(accruing),
    claimed: cents(claimed),
    recipients: cents(recipients),
    protocol: cents(claimed - recipients),
    paid: cents(paid),
    owed: cents(recipients - paid),
    launches: TOKENS.length,
  };
})();

/* Recent claims: small slices of each token's claimed fees, newest first. */
export const CLAIMS: Claim[] = (() => {
  const weights = TOKENS.map((t) => Math.sqrt(claimedOf(t)));
  const total = weights.reduce((a, b) => a + b, 0);
  const out: Claim[] = [];
  let minutes = 4;
  for (let n = 0; n < 40; n++) {
    let pick = rand() * total;
    let index = 0;
    while (pick > weights[index]) {
      pick -= weights[index];
      index++;
    }
    const token = TOKENS[Math.min(index, TOKENS.length - 1)];
    out.push({
      id: `k${n + 1}`,
      tokenAddress: token.address,
      creatorId: token.creatorId,
      amount: cents(Math.max(6.5, claimedOf(token) * between(0.0025, 0.012))),
      minutesAgo: minutes,
    });
    minutes += Math.round(between(3, 38));
  }
  return out;
})();

/* Recent payouts: milestone payments to creators who have been paid, newest first. */
export const PAYOUTS: Payout[] = (() => {
  const paidBooks = CREATOR_BOOK.filter((b) => b.paid > 0);
  const budget = new Map(paidBooks.map((b) => [b.creator.id, b.paid * 0.6]));
  const out: Payout[] = [];
  let minutes = 38;
  for (let n = 0; n < 36; n++) {
    const book = paidBooks[Math.floor(rand() * paidBooks.length)];
    const left = budget.get(book.creator.id) ?? 0;
    const amount = cents(Math.min(left, between(20, Math.max(24, book.paid / 6))));
    if (amount < 20) continue;
    budget.set(book.creator.id, left - amount);
    const token = book.tokens[Math.floor(rand() * book.tokens.length)];
    out.push({ id: `p${out.length + 1}`, tokenAddress: token.address, creatorId: book.creator.id, amount, minutesAgo: minutes });
    minutes += Math.round(between(25, 140));
  }
  return out;
})();

/* Daily series for the analytics charts, oldest first. */
export const DAILY = (() => {
  const days = 11;
  const fees = new Array(days).fill(0);
  const launches = new Array(days).fill(0);
  for (const t of TOKENS) {
    const age = Math.floor((BOOK_TIME - Date.parse(t.launchedAt)) / DAY);
    launches[days - 1 - Math.min(age, days - 1)] += 1;
    // A launch earns most in its first days and tails off after.
    const span = age + 1;
    const weights = Array.from({ length: span }, (_, k) => Math.pow(0.62, k));
    const sum = weights.reduce((a, b) => a + b, 0);
    weights.forEach((w, k) => {
      const index = days - 1 - (age - k);
      if (index >= 0) fees[index] += (t.fees * w) / sum;
    });
  }
  const labels = Array.from({ length: days }, (_, i) => {
    const d = new Date(BOOK_TIME - (days - 1 - i) * DAY);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  });
  return { labels, fees: fees.map(cents), launches };
})();

/** Throws at build time if a sample ever outgrows the book it samples. */
function assertBook() {
  for (const book of CREATOR_BOOK) {
    const sent = PAYOUTS.filter((p) => p.creatorId === book.creator.id).reduce((s, p) => s + p.amount, 0);
    if (sent > book.paid + 0.01) throw new Error(`Payout sample exceeds paid total for ${book.creator.name}`);
  }
  const claimedSample = CLAIMS.reduce((s, c) => s + c.amount, 0);
  if (claimedSample > TOTALS.claimed) throw new Error("Claim sample exceeds claimed total");
  const fees = DAILY.fees.reduce((a, b) => a + b, 0);
  if (Math.abs(fees - TOTALS.earned) > 1) throw new Error("Daily fees do not add up to the book");
}
assertBook();

/* Lookups */
export const creatorById = (id: string) => CREATORS.find((c) => c.id === id)!;
export const bookById = (id: string) => CREATOR_BOOK.find((b) => b.creator.id === id)!;
export const tokenByAddress = (address: string) =>
  TOKENS.find((t) => t.address.toLowerCase() === address.toLowerCase()) ?? null;
export const creatorByRoute = (platform: Platform, handle: string) =>
  CREATORS.find((c) => c.platform === platform && c.handle.toLowerCase() === handle.toLowerCase()) ?? null;

export const PLATFORM_NAME: Record<Platform, string> = {
  x: "X",
  spotify: "Spotify",
  twitch: "Twitch",
  github: "GitHub",
  wallet: "Wallet",
};

export function creatorPath(c: Creator) {
  if (c.platform === "spotify") return `/spotify/artist/${c.handle}`;
  return `/${c.platform}/${c.handle}`;
}

/** How a creator is written in running text: @handle, or the artist name on Spotify. */
export function creatorLabel(c: Creator) {
  return c.platform === "spotify" ? c.name : `@${c.handle}`;
}

/**
 * Profile link on the platform itself. The preview creators are fictional, so
 * only the project's own account links out; the rest would point at strangers.
 */
export function creatorExternal(c: Creator): string | null {
  return c.platform === "x" && c.handle === "bridgemoneycash" ? "https://x.com/bridgemoneycash" : null;
}

export const topTokens = () => [...TOKENS].sort((a, b) => b.fees - a.fees);
export const recentTokens = () => [...TOKENS].sort((a, b) => Date.parse(b.launchedAt) - Date.parse(a.launchedAt));
export const topCreators = () => [...CREATOR_BOOK].sort((a, b) => b.fees - a.fees);
export const mostPaid = () => [...CREATOR_BOOK].filter((b) => b.paid > 0).sort((a, b) => b.paid - a.paid);
