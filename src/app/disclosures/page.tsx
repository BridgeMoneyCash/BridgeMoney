import type { Metadata } from "next";
import { CHAIN } from "@/config/brand";
import { Legal } from "@/components/Legal";

export const metadata: Metadata = { title: "Disclosures" };

export default function Disclosures() {
  return (
    <Legal title="Disclosures">
      <ul>
        <li>Bridge Money is an independent project and is not affiliated with Robinhood Markets, X Corp, Spotify, Twitch or GitHub.</li>
        <li>Tokens launched through this site are created by their deployers. Bridge Money does not issue, endorse or vet them.</li>
        <li>
          Until the fee router is published on {CHAIN.name}, the figures on this site are a launch preview: fictional creators and launches that show how the protocol
          reports. They are marked “Preview” wherever they appear.
        </li>
        <li>The Bridge Money contracts have not had a third-party audit yet.</li>
        <li>Chain data shown as live, such as block height, gas and the ETH price, is read from {CHAIN.name} through this site&apos;s server.</li>
        <li>Nothing on this site is investment, legal or tax advice.</li>
      </ul>
    </Legal>
  );
}
