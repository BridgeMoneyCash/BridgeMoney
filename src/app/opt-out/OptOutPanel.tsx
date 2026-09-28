"use client";

import { useState } from "react";
import { CHAIN, shortAddress } from "@/config/brand";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useConnectModal } from "@/components/wallet/WalletUi";
import { LockIcon, WalletIcon } from "@/components/icons";
import { btn } from "@/lib/ui";

export function OptOutPanel() {
  const { address } = useWallet();
  const { open } = useConnectModal();
  const [asked, setAsked] = useState(false);
  return (
    <div className="mt-6 min-w-0 rounded-2xl border border-border bg-card/60 p-6">
      {!address ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-muted-foreground">Connect the wallet the request concerns. Account sign-in for X, Spotify, Twitch and GitHub opens with the fee router.</p>
          <button type="button" onClick={open} className={`${btn.primary} ${btn.md} px-4`}>
            <WalletIcon className="size-4" /> Connect wallet
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm">
            Request for <span className="font-mono">{shortAddress(address, 6, 4)}</span> on {CHAIN.name}.
          </p>
          <button type="button" onClick={() => setAsked(true)} className={`${btn.outline} ${btn.md} px-4`}>
            Leave me out
          </button>
          {asked && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-muted-foreground">
              <LockIcon className="mt-0.5 size-4 shrink-0" />
              Signed opt-out requests open with the fee router. Nothing was sent; until then, write to us from the account as described below and it is honored within 7
              days.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
