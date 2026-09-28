import { NextResponse } from "next/server";
import { readChainFacts, readTokenFacts } from "@/lib/chain-server";

export const dynamic = "force-dynamic";

/** Live Robinhood Chain facts for the page strips: block, gas, ETH / USD, token supply. */
export async function GET() {
  const [chain, token] = await Promise.all([readChainFacts(), readTokenFacts()]);
  return NextResponse.json({ ...chain, token }, { headers: { "cache-control": "no-store" } });
}
