import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { Legal } from "@/components/Legal";

export const metadata: Metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <Legal title="Privacy" updated="September 2026">
      <h2>What we keep</h2>
      <ul>
        <li>Public profile data of accounts that a token names or that someone searches: id, username, display name and avatar address.</li>
        <li>On-chain data: tokens, fee addresses, claims and payouts. This is public by nature.</li>
        <li>The address of a wallet you connect, only for as long as your browser keeps the session. It is stored in your browser, not on our servers.</li>
      </ul>
      <h2>What we never keep</h2>
      <p>Private keys, passwords, platform tokens or seed phrases. Connecting a wallet shares an address and nothing else, and this site never asks the wallet to sign on its own.</p>
      <h2>Removal</h2>
      <p>
        Write to <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> and your profile row is deleted within 7 days. On-chain records cannot be deleted by anyone.
      </p>
    </Legal>
  );
}
