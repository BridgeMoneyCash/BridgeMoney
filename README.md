# Bridge Money

**The Infrastructure of Programmable Money.**

Bridge Money ($BGN) routes token trading fees on Robinhood Chain to the creator a token is
launched for, and pays that creator in dollars. This repository is the full Bridge Money web
app. Anyone can read it, run it, and check how it works.

- Site: https://bridgemoney.network
- X: https://x.com/bridgemoneycash
- GitHub: https://github.com/BridgeMoneyCash/BridgeMoney
- Network: Robinhood Chain (chain id 4663)

## The problem

Tokens get launched in a creator's name every day: for a streamer, a musician, a developer,
an account on X. They generate trading fees from the first trade. The creator usually never
sees any of that money.

- **The fees go to whoever deployed the token.** The person the token is about has no claim
  on it and often doesn't even know it exists.
- **There is no neutral place to collect.** A creator who does find out has to trust a
  stranger to forward the fees, by hand, whenever they feel like it.
- **The money isn't usable.** Fees arrive as a mix of volatile tokens, not as a balance a
  creator can spend or plan around.
- **Nobody can check the numbers.** Holders can't see how much a token has earned, how much
  was paid out, or where the rest went.

## The solution

Bridge Money makes the creator the fee recipient from the moment a token launches.

1. **Launch for a creator.** A token is launched against a creator identity: an X account,
   a Spotify artist, a Twitch channel, a GitHub user, or a plain wallet.
2. **Fees are routed, not held.** Every trading fee goes to a fee router instead of the
   deployer's wallet.
3. **Every claim is split 80/20 on chain.** 80% belongs to the creator and 20% funds the
   protocol. The split is fixed and visible on every token page.
4. **The creator is paid in dollars.** The creator verifies the identity once, connects a
   wallet, and withdraws their share as dollars instead of a pile of tokens.
5. **Every step is public.** Explore, Payments, Analytics and Capital Flow show what each
   token earned, what was claimed, what was paid out, and the $BGN supply and burn.

## What you can try in this app

| Page | What it does |
| --- | --- |
| `/` | Overview: live launch ticker, top tokens and creators, recent payments |
| `/explore` | Every launch, with sorting and filters by platform |
| `/token/[address]` | One token: market figures, fee split, claims and payouts |
| `/x/[handle]`, `/spotify/artist/[id]`, `/twitch/[handle]`, `/github/[handle]`, `/wallet/[handle]` | A creator's profile and everything launched for them |
| `/launch` | Launch a token for a creator, with a live preview |
| `/claim` | Check payouts owed to a connected wallet |
| `/payments`, `/analytics`, `/capital-flow` | Totals, charts, and the path from a trading fee to a payout |
| `/docs` | How the protocol works |

**Connect wallet works for real.** It finds browser wallets (MetaMask, Rabby and others),
switches to Robinhood Chain or adds it, shows your ETH balance, and reconnects on the next
visit without a popup.

**The rest is still being built.** Until the fee router contracts are published:
- Launch, claim and withdraw stop after the wallet step with an "opens at launch" notice.
  No transaction is ever sent.
- Tokens, creators and payouts come from a preview book in `src/config/seed.ts`, and the
  site labels them "Preview". The creators in it are fictional.

**Live from Robinhood Chain:** block height, gas price, the Chainlink ETH/USD price, wallet
balances, and the $BGN supply once the contract address is set.

## Run it locally

You need Node.js 20 or newer. Download this repository (Code, Download ZIP) or fork it, then
open a terminal in its folder:

```bash
npm install
npm run build
npm start
```

Open http://localhost:4690. During development use `npm run dev` instead of the last two
steps.

No accounts or API keys are needed. The app runs on Robinhood Chain's public RPC.

### Optional: your own RPC

If the public RPC is slow or rate limited, point the app at your own endpoint (for example
Alchemy). Create `.env.local` in the project root with one of these variables:

| Variable | Used by | Value |
| --- | --- | --- |
| `ROBINHOOD_RPC_URL` | server only | Full HTTPS RPC URL for Robinhood Chain mainnet |
| `NEXT_PUBLIC_ROBINHOOD_RPC_URL` | browser and server | Same, but also visible to the browser |

If neither is set, the app uses `https://rpc.mainnet.chain.robinhood.com`, with
`https://robinhood-rpc.publicnode.com` as a fallback.

### Robinhood Chain in your wallet

The app adds the network for you. To add it by hand:

| Field | Value |
| --- | --- |
| Network name | Robinhood Chain |
| Chain ID | 4663 |
| RPC URL | https://rpc.mainnet.chain.robinhood.com |
| Currency | ETH |
| Explorer | https://robinhoodchain.blockscout.com |

## Project layout

```
src/app/            pages and API routes (/api/rpc read-only relay, /api/chain live figures)
src/components/     UI, wallet connect, contract address button
src/config/brand.ts name, links, network and token contract address
src/config/seed.ts  preview launch book
scripts/            icon and logo generation (npm run assets)
```

Built with Next.js 16, React 19, TypeScript and Tailwind CSS v4. Wallet connect uses the
standard wallet interfaces (EIP-6963, EIP-1193) with no wallet SDK.

## Token contract

The $BGN contract address is set in one place: `const CA` in `src/config/brand.ts`. Until it
is published, every contract button on the site reads "CA soon".

## License

All rights reserved.
