import { BOOK_TIME } from "@/config/seed";

const usd2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** $1,234.56 */
export const usd = (v: number) => usd2.format(v);

/** $4,453 below ten thousand, then $12.6K / $3.1M. */
export function usdShort(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 10_000) return `$${(v / 1_000).toFixed(1)}K`;
  return usd0.format(v);
}

/** Fees keep cents until they pass ten thousand. */
export function usdFees(v: number) {
  return v >= 10_000 ? usdShort(v) : usd(v);
}

/** Prices of fresh launches are tiny; keep significant digits instead of cents. */
export function usdPrice(v: number) {
  if (v >= 1) return usd(v);
  return `$${v.toPrecision(3)}`;
}

export function compact(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(Math.round(v));
}

export function ago(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

/** Age of a launch relative to the preview book, e.g. "3d" or "7h". */
export function age(iso: string) {
  return ago(Math.max(1, Math.round((BOOK_TIME - Date.parse(iso)) / 60_000)));
}

export function launchedLabel(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }) + " UTC";
}

export const pct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
