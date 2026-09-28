/* Shared class strings, so every pill and card on the site is the same shape. */

const base =
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap border font-medium transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0";

export const btn = {
  primary: `${base} border-transparent bg-primary text-primary-foreground hover:bg-primary/80`,
  outline: `${base} border-input bg-input/30 text-foreground hover:bg-input/50`,
  sm: "h-8 rounded-full px-2.5 text-sm",
  md: "h-9 rounded-full px-2.5 text-sm",
  lg: "h-11 rounded-full px-6 text-base",
};

export const card = "min-w-0 rounded-2xl border border-border bg-card/60";
export const tile = "rounded-xl bg-muted/50 px-3 py-2.5";
