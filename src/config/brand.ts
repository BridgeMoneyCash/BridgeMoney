// Single place to change project identity. Everything on the site reads from here.
// The contract address below is a placeholder until launch: replace CA with the
// real 0x address and every CA button, the token page and the footer follow.

const CA = "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

export const isAddress = (v: string): v is `0x${string}` =>
  /^0x[0-9a-fA-F]{40}$/.test(v);

export const BRAND = {
  name: "Bridge Money",
  wordmark: "Bridgemoney",
  ticker: "BRIDGE",
  symbol: "$BRIDGE",
  domain: "bridgemoney.network",
  display: "Bridgemoney.Network",
  url: "https://bridgemoney.network",
  slogan: "The Infrastructure of Programmable Money",
  description:
    "Bridge Money routes token creator fees on Robinhood Chain to the creator a token names, splits every claim 80/20 on chain and pays the creator share in dollars.",
  x: "https://x.com/bridgemoneycash",
  xHandle: "bridgemoneycash",
  /** Public GitHub repo. Empty hides every GitHub link on the site. */
  github: "https://github.com/BridgeMoneyCash/BridgeMoney" as string,
  email: "team@bridgemoney.network",
  ca: CA,
} as const;

// Public endpoints are the default. An operator can point the site at a
// private RPC with ROBINHOOD_RPC_URL (server) / NEXT_PUBLIC_ROBINHOOD_RPC_URL
// (browser and server). Both are optional.
const PUBLIC_RPC = "https://rpc.mainnet.chain.robinhood.com";

export const CHAIN = {
  id: 4663,
  hex: "0x1237",
  name: "Robinhood Chain",
  nativeSymbol: "ETH",
  decimals: 18,
  publicRpc: PUBLIC_RPC,
  rpc: process.env.NEXT_PUBLIC_ROBINHOOD_RPC_URL || PUBLIC_RPC,
  /** Second public endpoint, used for reads only when the first one fails. */
  fallbackRpc: "https://robinhood-rpc.publicnode.com",
  explorer: "https://robinhoodchain.blockscout.com",
  explorerName: "Blockscout",
  /** Chainlink ETH / USD proxy on Robinhood Chain, 8 decimals. */
  ethUsdFeed: "0x78F3556b67E17Df817D51Ef5a990cDaF09E8d3A9",
} as const;

/** RPC for server code: the private endpoint when set, else the public one. */
export function serverRpc() {
  return (
    process.env.ROBINHOOD_RPC_URL ||
    process.env.NEXT_PUBLIC_ROBINHOOD_RPC_URL ||
    PUBLIC_RPC
  );
}

export const TOKEN = {
  get isLive() {
    return isAddress(BRAND.ca);
  },
};

/** Protocol split applied to every claim. */
export const SPLIT = { recipient: 80, protocol: 20 } as const;

export function explorerAddress(address: string) {
  return `${CHAIN.explorer}/address/${address}`;
}
export function explorerToken(address: string) {
  return `${CHAIN.explorer}/token/${address}`;
}
export function explorerTx(hash: string) {
  return `${CHAIN.explorer}/tx/${hash}`;
}
export function shortAddress(address: string, head = 6, tail = 4) {
  if (address.length <= head + tail + 2) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}
