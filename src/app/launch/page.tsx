import type { Metadata } from "next";
import { LaunchForm } from "./LaunchForm";

export const metadata: Metadata = { title: "Launch", description: "Launch a token on Robinhood Chain whose creator fees pay a creator in dollars." };

export default function Launch() {
  return (
    <div className="space-y-5">
      <div className="card-lift min-w-0 rounded-2xl border border-white/10 bg-card/60 px-6 py-7 sm:px-8">
        <h1 className="text-[26px] font-semibold tracking-tight">Launch a token that pays a creator</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">
          Create a token on Robinhood Chain with its creator fees routed to an account on X, Spotify, Twitch, GitHub or a wallet, or hand the fees of a token you already
          launched to one.
        </p>
      </div>
      <LaunchForm />
    </div>
  );
}
