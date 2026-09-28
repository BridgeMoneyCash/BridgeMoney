"use client";

import { CHAIN, explorerAddress, shortAddress } from "@/config/brand";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useConnectModal } from "@/components/wallet/WalletUi";
import { LogoMark } from "@/components/Logo";
import { ExternalIcon, LockIcon, WalletIcon } from "@/components/icons";
import { PlatformGlyph } from "@/components/ui/Art";
import { btn } from "@/lib/ui";

export function ClaimPanel() {
  const { address, balance, onRobinhoodChain, switchNetwork, switching, disconnect } = useWallet();
  const { open } = useConnectModal();

  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl border border-border bg-card/60 p-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(255_255_255/8%),transparent_50%)]" />
      <div className="relative">
        <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-[22%] border border-white/10 bg-black shadow-[0_0_60px_-20px_rgba(255,255,255,0.45)]">
          <LogoMark className="size-11" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Payout status</h1>
        <p className="mt-3 max-w-md text-muted-foreground">See what launches have earned for your account, what is owed to you, and withdraw it in dollars.</p>

        {!address ? (
          <>
            <button type="button" onClick={open} className={`${btn.primary} mt-6 h-12 w-full rounded-full px-6 text-base sm:w-auto`}>
              <WalletIcon className="size-4" /> Connect wallet
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Connect the wallet that receives payouts. Account sign-in for X, Spotify, Twitch and GitHub opens with the fee router; it only ever checks the account a token
              named.
            </p>
          </>
        ) : (
          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/60 px-3 py-2.5 text-sm">
              <span className="inline-flex items-center gap-2">
                <PlatformGlyph platform="wallet" tinted className="size-4" />
                <a href={explorerAddress(address)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono hover:underline">
                  {shortAddress(address, 6, 4)} <ExternalIcon className="size-3" />
                </a>
              </span>
              <span className="text-muted-foreground tabular">{balance ?? "…"} ETH on {CHAIN.name}</span>
            </div>
            <dl className="grid grid-cols-2 gap-3">
              {[
                ["Ready to pay", "$0.00"],
                ["Settling", "$0.00"],
                ["Still accruing", "$0.00"],
                ["Paid out", "$0.00"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-muted/50 px-3 py-2.5">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="font-semibold tabular">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm">
              <LockIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">
                No launch names this address yet. Withdrawals open when the fee router is published on {CHAIN.name}; anything credited to you stays yours until you
                withdraw it.
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {!onRobinhoodChain && (
                <button type="button" onClick={switchNetwork} disabled={switching} className={`${btn.primary} ${btn.md}`}>
                  {switching ? "Switching…" : `Switch to ${CHAIN.name}`}
                </button>
              )}
              <button type="button" disabled className={`${btn.outline} ${btn.md}`}>
                Withdraw in dollars
              </button>
              <button type="button" onClick={disconnect} className={`${btn.outline} ${btn.md}`}>
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
