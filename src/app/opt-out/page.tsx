import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { Legal } from "@/components/Legal";
import { OptOutPanel } from "./OptOutPanel";

export const metadata: Metadata = { title: "Opt out" };

export default function OptOut() {
  return (
    <Legal title="Opt out">
      <p>
        On X, Spotify, Twitch and GitHub, Bridge Money never moves money to you by itself: a balance is only credited in your name, and only you can withdraw it. Wallet
        recipients are paid automatically, and this request stops that from the next claim.
      </p>
      <p>Within 7 days your account comes off the site, goes on a do-not-pay list, and fees are no longer claimed for tokens that name it. Anything already credited stays yours.</p>
      <OptOutPanel />
      <p className="text-sm text-muted-foreground">
        Cannot connect? Write from the account, or with reasonable proof that you control it, to <a href={BRAND.x}>@{BRAND.xHandle}</a> or{" "}
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
      </p>
    </Legal>
  );
}
