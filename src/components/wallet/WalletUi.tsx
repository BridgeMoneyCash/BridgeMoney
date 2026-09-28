"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { CHAIN, explorerAddress, shortAddress } from "@/config/brand";
import { useWallet, type DiscoveredWallet } from "@/components/wallet/WalletProvider";
import { CheckIcon, CloseIcon, CopyIcon, ExternalIcon, LoaderIcon, LogOutIcon, WalletIcon } from "@/components/icons";
import { btn } from "@/lib/ui";

/* Connect flow: one modal for the whole site, opened from the header or from
   any page that needs an account (launch, payout status, opt out). */

type Ui = { open: () => void };
const UiContext = createContext<Ui>({ open: () => {} });
export const useConnectModal = () => useContext(UiContext);

const noop = () => () => {};
/** True after hydration; portals need document.body. */
function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function WalletUiProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const mounted = useMounted();
  return (
    <UiContext.Provider value={{ open }}>
      {children}
      {mounted && isOpen && createPortal(<ConnectModal onClose={() => setOpen(false)} />, document.body)}
    </UiContext.Provider>
  );
}

function ConnectModal({ onClose }: { onClose: () => void }) {
  const { wallets, connect, connecting, error, clearError, address } = useWallet();
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  useEffect(() => clearError, [clearError]);

  const pick = async (wallet: DiscoveredWallet) => {
    setPending(wallet.rdns);
    const ok = await connect(wallet);
    setPending(null);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="Connect a wallet">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="card-lift relative w-full max-w-sm rounded-3xl border border-white/10 bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight">Connect wallet</div>
            <div className="text-xs text-muted-foreground">{CHAIN.name} · chain id {CHAIN.id}</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground">
            <CloseIcon className="size-4" />
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {wallets.map((wallet) => (
            <li key={wallet.rdns}>
              <button
                type="button"
                disabled={connecting || !!wallet.unsupported}
                onClick={() => pick(wallet)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-background/60 px-3 py-2.5 text-left transition-colors hover:border-foreground/25 disabled:opacity-50"
              >
                {wallet.icon ? (
                  <img src={wallet.icon} alt="" className="size-8 rounded-lg" />
                ) : (
                  <span className="grid size-8 place-items-center rounded-lg bg-muted">
                    <WalletIcon className="size-4" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{wallet.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{wallet.unsupported ?? "Detected in this browser"}</span>
                </span>
                {pending === wallet.rdns && <LoaderIcon className="size-4 animate-spin text-muted-foreground" />}
              </button>
            </li>
          ))}
        </ul>

        {wallets.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-sm text-muted-foreground">
            No browser wallet found. Install MetaMask, Rabby or another wallet that supports custom networks, then reload this page.
          </div>
        )}

        {error && <p className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}
        {address && !error && <p className="mt-3 text-xs text-muted-foreground">Connected as {shortAddress(address)}.</p>}

        <p className="hint mt-4 leading-relaxed">
          Connecting shares your address and nothing else. {CHAIN.name} is added to the wallet if it is missing. This site never asks for a key and never sends a transaction on its own.
        </p>
      </div>
    </div>
  );
}

/** Header button: "Connect wallet" or the connected account with its balance. */
export function ConnectButton() {
  const { address, balance, onRobinhoodChain, switchNetwork, switching, disconnect, walletName } = useWallet();
  const { open } = useConnectModal();
  const mounted = useMounted();
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menu]);

  if (!mounted || !address) {
    return (
      <button type="button" onClick={open} className={`${btn.outline} ${btn.md}`}>
        <WalletIcon className="size-4" />
        <span className="hidden sm:inline">Connect wallet</span>
        <span className="sm:hidden">Connect</span>
      </button>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard blocked; the address is visible in the menu.
    }
  };

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setMenu((v) => !v)} aria-expanded={menu} className={`${btn.outline} ${btn.md} pl-1.5`}>
        <span className={`size-2 rounded-full ${onRobinhoodChain ? "bg-success" : "bg-destructive"} ml-1`} />
        {balance !== null && <span className="hidden text-muted-foreground tabular lg:inline">{balance} ETH</span>}
        <span className="font-mono text-[13px]">{shortAddress(address, 5, 4)}</span>
      </button>
      {menu && (
        <div className="card-lift absolute right-0 top-11 z-50 w-72 rounded-2xl border border-white/10 bg-card p-3">
          <div className="rounded-xl bg-muted/60 px-3 py-2.5">
            <div className="text-xs text-muted-foreground">{walletName ?? "Wallet"}</div>
            <div className="mt-0.5 flex items-center gap-2 font-mono text-sm">
              {shortAddress(address, 8, 6)}
              <button type="button" onClick={copy} aria-label="Copy address" className="text-muted-foreground hover:text-foreground">
                {copied ? <CheckIcon className="size-3.5 text-success" /> : <CopyIcon className="size-3.5" />}
              </button>
            </div>
            <div className="mt-2 text-2xl font-semibold tabular chrome-text">{balance ?? "…"} ETH</div>
            <div className="text-[11px] text-muted-foreground">Balance on {CHAIN.name}</div>
          </div>
          {!onRobinhoodChain && (
            <button type="button" onClick={switchNetwork} disabled={switching} className={`${btn.primary} ${btn.sm} mt-3 w-full`}>
              {switching ? "Switching…" : `Switch to ${CHAIN.name}`}
            </button>
          )}
          <div className="mt-2 grid gap-1 text-sm">
            <a href={explorerAddress(address)} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg px-2 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              View on {CHAIN.explorerName} <ExternalIcon className="size-3.5" />
            </a>
            <button
              type="button"
              onClick={() => {
                setMenu(false);
                disconnect();
              }}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Disconnect <LogOutIcon className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
