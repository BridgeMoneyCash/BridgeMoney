import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND, CHAIN, TOKEN, shortAddress } from "@/config/brand";

export const metadata: Metadata = { title: "Docs", description: "How Bridge Money routes creator fees on Robinhood Chain and settles them in dollars." };

type Section = { id: string; title: string; body: ReactNode };

const SECTIONS: Section[] = [
  {
    id: "overview",
    title: "Overview",
    body: (
      <>
        <p>
          Bridge Money is settlement infrastructure for creator fees. A token routes its creator fees to a Bridge Money fee address, the protocol claims them on chain,
          and 80% is paid in dollars to the creator the token names. The other 20% funds the protocol. Every step is recorded against the claim that produced it.
        </p>
        <p>
          The creator does not have to do anything first. There is no account to open and no wallet to connect in advance, so a payout can come from a launch they have
          never seen. Nothing moves out of a creator&apos;s balance without that creator.
        </p>
        <ol className="mt-4 space-y-3">
          {[
            ["A token routes its fees", "At launch, the deployer sets the Bridge Money fee address for the chosen account as the creator fee recipient."],
            ["The description names the creator", "One line tells readers who is paid, for example “Fees to @yourhandle via Bridge Money”."],
            ["The token is indexed", "The indexer sees the routing on chain and lists the token. There is no approval queue."],
            ["Fees are claimed", "Accrued creator fees are claimed on a schedule and each claim is recorded against its own transaction."],
            ["The creator is paid in dollars", "The creator proves the account and withdraws the share as USDG in one transaction, gas covered."],
          ].map(([t, b], i) => (
            <li key={t} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">{i + 1}</span>
              <span>
                <span className="block font-medium text-foreground">{t}</span>
                <span className="block text-muted-foreground">{b}</span>
              </span>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    id: "supported-platforms",
    title: "Supported platforms",
    body: (
      <>
        <p>A creator is an account somewhere. Bridge Money pays the account a token names, and the creator proves it is theirs with that same account.</p>
        <DocTable
          rows={[
            ["X", "Named by handle. The fee address follows the account's permanent id, so a rename changes nothing."],
            ["Spotify", "Artists by artist link, users by user id. Artist pages have no sign-in, so artist shares are paid on request and recorded on chain."],
            ["Twitch", "Named by channel. The fee address follows the numeric channel id, so renaming the channel changes nothing."],
            ["GitHub", "People and organizations, by username or link. The fee address follows the numeric account id."],
            ["Wallet", "Any address on Robinhood Chain. Shares are pushed to it automatically, no sign-in involved."],
          ]}
        />
      </>
    ),
  },
  {
    id: "network",
    title: "Network and venue",
    body: (
      <>
        <p>
          Bridge Money runs on {CHAIN.name} (chain id {CHAIN.id}). Tokens launch on a bonding curve and graduate into a pool with locked liquidity; the creator fee rate is
          the same before and after graduation.
        </p>
        <DocTable
          rows={[
            ["Chain", `${CHAIN.name}, id ${CHAIN.id}, native gas in ETH`],
            ["Pairing", "ETH by default. A launch priced in an approved token pays fees in that token and is settled from it."],
            ["Other chains", "Not supported. A token whose fee recipient is not a Bridge Money fee address is not indexed."],
          ]}
        />
      </>
    ),
  },
  {
    id: "routing-fees",
    title: "Routing fees",
    body: (
      <>
        <p>
          The creator fee recipient is set when the token is created, next to its name and image. The <Link href="/launch">launch page</Link> fills it in from the account you
          pick, so routing fees is part of creating the token rather than a second step.
        </p>
        <p>
          There is no separate lock. Only the current recipient can hand the fees on, so once Bridge Money holds them the deployer cannot take them back. A token launched
          earlier can be registered later: its current recipient transfers the fees to the fee address for the chosen account, which the <em>Register</em> tab does in one
          transaction.
        </p>
      </>
    ),
  },
  {
    id: "fee-line",
    title: "The fee line",
    body: (
      <>
        <p>The fee address already decides who is paid. The fee line exists so that people reading the token know it too. Put one of these in the description:</p>
        <ul>
          <li>
            <code>Fees to @yourhandle via Bridge Money</code> for X
          </li>
          <li>
            <code>Fees to spotify:artistid via Bridge Money</code> for a Spotify artist
          </li>
          <li>
            <code>Fees to twitch:channel via Bridge Money</code> or <code>github:username</code> for those platforms
          </li>
        </ul>
        <p>Keep the format exact and write anything else around it. The launch page adds the line for you; the whole description is limited to 256 characters.</p>
      </>
    ),
  },
  {
    id: "the-80-20-split",
    title: "The 80/20 split",
    body: (
      <>
        <p>Every claim divides the same way. Nothing is negotiated and there are no tiers.</p>
        <DocTable
          rows={[
            ["To the creator", "80%, withdrawn in dollars by the named account"],
            ["To the protocol", "20%, sent to the treasury in the same transaction"],
            ["When", "Per claim, at claim time, on chain"],
            ["Extra fees", "None. The 20% is all of it."],
            ["Can it change", "The creator share can be raised, never lowered below 50%."],
          ]}
        />
      </>
    ),
  },
  {
    id: "how-claims-work",
    title: "How claims work",
    body: (
      <>
        <p>
          Creator fees do not arrive continuously. They build up on the curve, or in the pool after graduation, and reach escrow when the launchpad sweeps them. Bridge Money
          claims from escrow on a schedule rather than on every trade, because claiming per trade would cost more in gas than a quiet token earns.
        </p>
        <p>
          Each claim is written to the ledger under its own transaction, so it cannot be counted twice and every balance can be traced back to the event that created it.
        </p>
        <h3>Payout milestones</h3>
        <p>
          A creator&apos;s share builds until it crosses $20, then $50, $100, $250, $500, $1,000 and every $1,000 after that. Each crossing pays the full balance. Smaller
          balances stay credited and carry forward.
        </p>
      </>
    ),
  },
  {
    id: "getting-paid",
    title: "Getting paid",
    body: (
      <>
        <p>
          If a token named your account, the money is already yours. There is no form to fill in: prove the account on the <Link href="/claim">payout status page</Link> and
          withdraw in dollars whenever you like.
        </p>
        <p>
          You are not required to acknowledge or accept anything. Receiving a payment does not make you a customer of Bridge Money or a promoter of the token that named you.
          Payments may be taxable where you live; nothing here is tax advice.
        </p>
      </>
    ),
  },
  {
    id: "claim-or-push",
    title: "Claim or push",
    body: (
      <>
        <p>A share reaches its creator in one of two ways, and the platform decides which.</p>
        <DocTable
          rows={[
            ["Claim", "The share is credited on chain in the account's name. The creator proves the account and withdraws USDG; gas is covered. Nobody else can move it."],
            ["Push", "The share is sent to an address the creator already has, whenever it crosses a milestone. Used for wallet recipients."],
          ]}
        />
        <p>Either way the payout is recorded against the account&apos;s fee address, so nothing is paid twice, and a creator can ask to be left out at any time.</p>
      </>
    ),
  },
  {
    id: "public-receipt",
    title: "The public receipt",
    body: (
      <p>
        Every payout is announced. <a href={BRAND.x}>@{BRAND.xHandle}</a> posts the amount and the token it came from, and every claim and payout is listed on the{" "}
        <Link href="/payments">payments</Link> page. Most creators were not asked before a token named them, so the receipt is usually how they find out.
      </p>
    ),
  },
  {
    id: "treasury",
    title: "Treasury and settlement",
    body: (
      <>
        <p>
          Tokens earn their fees in ETH on {CHAIN.name}; creators are paid in dollars. The treasury is where the two meet: fees are claimed on chain, the creator share is
          converted to USDG and credited, and the protocol share stays in the treasury.
        </p>
        <DocTable
          rows={[
            ["Fee router", "Published at launch"],
            [`${BRAND.symbol} token`, TOKEN.isLive ? shortAddress(BRAND.ca, 8, 6) : "Published at launch"],
            ["Price reference", "Chainlink ETH / USD on Robinhood Chain"],
            ["Chain", `${CHAIN.name}, id ${CHAIN.id}`],
          ]}
        />
      </>
    ),
  },
  {
    id: "bgn",
    title: `The ${BRAND.symbol} token`,
    body: (
      <p>
        {BRAND.symbol} is the Bridge Money token on {CHAIN.name}. Its contract address is shown in the header and footer of every page once it is published; until then the
        copy buttons show that it is coming. The burned share of its supply on the <Link href="/analytics">analytics</Link> page is read live from the chain.
      </p>
    ),
  },
  {
    id: "stopping-payments",
    title: "Stopping payments",
    body: (
      <p>
        On X, Spotify, Twitch and GitHub, Bridge Money never pushes money to you: a balance is credited in your name and only you can withdraw it. Wallet recipients are
        paid automatically, and asking to be left out stops that from the next claim. Use the <Link href="/opt-out">opt-out page</Link>, or write from the account to{" "}
        <a href={BRAND.x}>@{BRAND.xHandle}</a> or <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>. Removal is honored within 7 days, and anything already credited to
        you stays yours.
      </p>
    ),
  },
  {
    id: "not-indexed",
    title: "If a token is not showing",
    body: (
      <DocTable
        rows={[
          ["Wrong recipient", "The creator fee recipient is not a Bridge Money fee address. Compare it with the address the launch page gave you."],
          ["Unknown account", "The fee address belongs to an account nobody looked up here before the launch. Register the token from the Register tab."],
          ["Too recent", "The indexer reads the chain every minute. A token created seconds ago has not been seen yet."],
          ["Redirected", "The fees were moved away from Bridge Money. The token stays listed but no longer pays the creator."],
        ]}
      />
    ),
  },
  {
    id: "glossary",
    title: "Glossary",
    body: (
      <DocTable
        rows={[
          ["Creator fees", "The share of trading fees paid to a token's creator fee recipient, plus any creator tax."],
          ["Fee escrow", "The launchpad contract that holds swept creator fees until they are claimed."],
          ["Fee address", "The Bridge Money address that stands in as creator fee recipient for one creator account."],
          ["Claim", "An on-chain transaction in which Bridge Money collects accrued creator fees."],
          ["Creator share", "80% of a claim, payable to the named account."],
          ["Protocol share", "20% of a claim, kept by the treasury."],
          ["Payout", "Money that reached a creator, by claim or by push."],
          ["Treasury", "The address that receives the protocol share and settles creator shares into dollars."],
        ]}
      />
    ),
  },
];

function DocTable({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/60">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="font-medium text-foreground">{k}</dt>
          <dd className="text-muted-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Docs() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16rem_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="eyebrow mb-3">Docs</div>
        <ol className="space-y-1 text-sm">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="flex gap-2 rounded-lg px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                <span className="w-5 shrink-0 text-xs leading-5 tabular">{i + 1}</span>
                <span>{s.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </aside>
      <article className="prose-doc min-w-0 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">How Bridge Money works</h1>
        <p className="text-lg text-muted-foreground">
          {BRAND.slogan}. A token routes its creator fees to Bridge Money, the protocol claims them on chain, and 80% is paid in dollars to the creator it names on X,
          Spotify, Twitch, GitHub or a wallet.
        </p>
        {SECTIONS.map((s, i) => (
          <section key={s.id}>
            <h2 id={s.id}>
              {i + 1}. {s.title}
            </h2>
            {s.body}
          </section>
        ))}
        <p className="text-xs text-muted-foreground">Independent project, not affiliated with Robinhood, X, Spotify, Twitch or GitHub.</p>
      </article>
    </div>
  );
}
