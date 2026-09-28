import type { Metadata } from "next";
import Link from "next/link";
import { ClaimPanel } from "./ClaimPanel";

export const metadata: Metadata = { title: "Payout status", description: "Check what is owed to your account and withdraw it in dollars." };

const STEPS = [
  ["Prove the account", "Connect the wallet or sign in with the account a token named. That is how the balance is matched to you. Nothing else is checked."],
  ["See what you are owed", "Ready to pay, settling, and still accruing on the curve. All three belong to you."],
  ["Withdraw in dollars", "Send the balance as USDG to any address on Robinhood Chain, gas covered. It stays credited to you until you do."],
];

export default function Claim() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ClaimPanel />
      <div className="min-w-0 rounded-2xl border border-border bg-card/60 p-8">
        <div className="eyebrow">How it works</div>
        <ol className="mt-4 space-y-4">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">{i + 1}</span>
              <span>
                <span className="block font-medium">{title}</span>
                <span className="block text-sm text-muted-foreground">{body}</span>
              </span>
            </li>
          ))}
        </ol>
        <Link href="/docs#getting-paid" className="mt-6 inline-block text-sm underline underline-offset-4">
          Read more in the docs
        </Link>
      </div>
    </div>
  );
}
