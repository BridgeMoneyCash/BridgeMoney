import type { Metadata } from "next";
import { BRAND, CHAIN } from "@/config/brand";
import { Legal } from "@/components/Legal";

export const metadata: Metadata = { title: "Terms of Use" };

export default function Terms() {
  return (
    <Legal title="Terms of Use" updated="September 2026">
      <h2>1. What Bridge Money is</h2>
      <p>
        Bridge Money is settlement software for creator fees on {CHAIN.name}. It indexes launches whose creator fees are routed to it, claims those fees, and credits the
        creator share to the account the token names on X, Spotify, Twitch, GitHub or a wallet. Creator shares are credited on chain in the creator&apos;s name; Bridge Money
        does not hold them in its own accounts.
      </p>
      <h2>2. Routing fees means accepting these terms</h2>
      <p>
        Routing a token&apos;s creator fees to a Bridge Money fee address is acceptance of these terms by the deployer. The deployer is responsible for the token, its
        description and anything said about it.
      </p>
      <h2>3. The split</h2>
      <p>Every claim is divided on chain: 80% to the creator share and 20% to the protocol treasury. The creator share may be raised but never set below 50%.</p>
      <h2>4. Creators</h2>
      <p>
        Being named by a token creates no relationship with Bridge Money. A creator may withdraw, ignore, redirect or opt out. Bridge Money does not endorse any token and
        a creator named by one does not endorse it either.
      </p>
      <h2>5. No advice, no guarantees</h2>
      <p>
        Tokens are volatile and can lose all value. Nothing on this site is investment, legal or tax advice. The software is provided as is, and on-chain transactions cannot
        be reversed.
      </p>
      <h2>6. Contact</h2>
      <p>
        Questions go to <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> or <a href={BRAND.x}>@{BRAND.xHandle}</a> on X.
      </p>
    </Legal>
  );
}
