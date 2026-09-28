"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CHAIN, isAddress } from "@/config/brand";
import { PLATFORM_NAME, type Platform } from "@/config/seed";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useConnectModal } from "@/components/wallet/WalletUi";
import { CheckIcon, ImagePlusIcon, LockIcon, SearchIcon } from "@/components/icons";
import { PlatformGlyph } from "@/components/ui/Art";
import { btn } from "@/lib/ui";

const PLATFORMS: Platform[] = ["x", "spotify", "twitch", "github", "wallet"];

const HANDLE_HINT: Record<Platform, { placeholder: string; hint: string; prefix: string }> = {
  x: { placeholder: "Search X for an account", hint: "An X handle, with or without the @.", prefix: "@" },
  spotify: { placeholder: "Artist name or artist link", hint: "An artist link, or a user id from a profile link.", prefix: "" },
  twitch: { placeholder: "Channel name", hint: "A channel name or a twitch.tv link.", prefix: "" },
  github: { placeholder: "Username or organization", hint: "A GitHub username, an organization, or a github.com link.", prefix: "" },
  wallet: { placeholder: "0x address on Robinhood Chain", hint: "Payouts are pushed to this address, no sign-in needed.", prefix: "" },
};

function feeTarget(platform: Platform, handle: string) {
  const h = handle.trim().replace(/^@/, "") || "handle";
  switch (platform) {
    case "x":
      return `@${h}`;
    case "spotify":
      return `spotify:${h}`;
    case "twitch":
      return `twitch:${h}`;
    case "github":
      return `github:${h}`;
    case "wallet":
      return h.length > 14 ? `${h.slice(0, 6)}…${h.slice(-4)}` : h;
  }
}

export function LaunchForm() {
  const { address, onRobinhoodChain, switchNetwork, switching } = useWallet();
  const { open } = useConnectModal();
  const [mode, setMode] = useState<"launch" | "register">("launch");
  const [platform, setPlatform] = useState<Platform>("x");
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [devBuy, setDevBuy] = useState("");
  const [tax, setTax] = useState("0");
  const [agree, setAgree] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const [notice, setNotice] = useState(false);

  useEffect(() => () => {
    if (image) URL.revokeObjectURL(image);
  }, [image]);

  const feeLine = `Fees to ${feeTarget(platform, handle)} via Bridge Money`;
  const described = description ? `${description.trim()} ${feeLine}` : feeLine;
  const taxValue = Math.min(10, Math.max(0, Number(tax) || 0));

  const valid = useMemo(() => {
    const h = handle.trim().replace(/^@/, "");
    const handleOk = platform === "wallet" ? isAddress(h) : h.length >= 2;
    if (mode === "register") return handleOk && isAddress(tokenAddress.trim()) && agree;
    return handleOk && name.trim().length > 0 && /^[A-Za-z0-9]{2,10}$/.test(ticker.trim()) && described.length <= 256 && agree;
  }, [handle, platform, mode, tokenAddress, agree, name, ticker, described]);

  const pickImage = (file: File | undefined) => {
    setImageError(null);
    if (!file) return;
    if (!/^image\/(png|jpeg|gif|webp)$/.test(file.type)) return setImageError("Use a PNG, JPG, GIF or WebP image.");
    if (file.size > 4 * 1024 * 1024) return setImageError("The image is larger than 4 MB.");
    setImage(URL.createObjectURL(file));
  };

  const action = () => {
    if (!address) return open();
    if (!onRobinhoodChain) return switchNetwork();
    setNotice(true);
  };

  const actionLabel = !address
    ? "Connect wallet"
    : !onRobinhoodChain
      ? switching
        ? "Switching…"
        : `Switch to ${CHAIN.name}`
      : mode === "launch"
        ? "Launch token"
        : "Redirect fees";

  const h = HANDLE_HINT[platform];

  return (
    <div className="card-lift grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-card/50 lg:grid-cols-[1fr_20.5rem]">
      <div className="min-w-0 p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[22px] font-semibold tracking-tight">{mode === "launch" ? "Launch token" : "Register a token"}</h2>
          <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-[13px]">
            {(["launch", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setNotice(false);
                }}
                className={`rounded-full px-3.5 py-1.5 capitalize transition-colors ${mode === m ? "bg-white text-black" : "text-muted-foreground hover:text-foreground"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-3 py-1.5 text-[13px] font-medium">
            <span className="size-1.5 rounded-full bg-success" /> {CHAIN.name}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[13px] text-muted-foreground">Bonding curve · ETH pair</span>
        </div>

        <div className="mb-5">
          <label className="field-label">Fees sent to</label>
          <div className="mb-2 flex flex-wrap gap-1.5" role="tablist" aria-label="Platform">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={platform === p}
                onClick={() => setPlatform(p)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
                  platform === p ? "border-white/25 bg-white/[0.08] text-foreground" : "border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <PlatformGlyph platform={p} tinted className="size-3.5" />
                {PLATFORM_NAME[p]}
              </button>
            ))}
          </div>
          <label className="field flex items-center gap-2 py-0 pl-3.5 focus-within:border-white/30 [&_input]:py-[0.7rem]">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            {h.prefix && <span className="text-muted-foreground">{h.prefix}</span>}
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder={h.placeholder}
              aria-label={`${PLATFORM_NAME[platform]} account that receives the fees`}
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
          </label>
          <p className="hint mt-1.5">{h.hint}</p>
        </div>

        {mode === "register" ? (
          <div>
            <label className="field-label">Token address</label>
            <input value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} className="field font-mono" placeholder="0x…" />
            <p className="hint mt-1.5">
              A token you already launched on {CHAIN.name}. Its current fee recipient hands the fees over in one transaction.
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_11rem]">
              <div>
                <label className="field-label">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={32} className="field" placeholder="Harbor Light" />
              </div>
              <div>
                <label className="field-label">Ticker</label>
                <input value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} maxLength={10} className="field" placeholder="HARBOR" />
              </div>
            </div>
            <div className="mt-4">
              <label className="field-label">Token image</label>
              <label className="flex w-full cursor-pointer items-center gap-4 rounded-[0.9rem] border border-dashed border-white/15 bg-white/[0.03] px-4 py-4 text-left transition-colors hover:border-white/30 hover:bg-white/[0.05]">
                <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/[0.06] text-muted-foreground">
                  {image ? <img src={image} alt="" className="size-full object-cover" /> : <ImagePlusIcon className="size-5" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-medium">{image ? "Change image" : "Choose image"}</span>
                  <span className="hint block">PNG, JPG, GIF or WebP up to 4 MB. It stays in this browser until launch.</span>
                </span>
                <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="sr-only" onChange={(e) => pickImage(e.target.files?.[0])} />
              </label>
              {imageError && <p className="mt-1.5 text-xs text-destructive">{imageError}</p>}
            </div>
            <div className="mt-4">
              <label className="field-label">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="field min-h-24 resize-y" placeholder="What the token is about." />
            </div>
            <div className="section-sep">
              <label className="field-label">Fee line</label>
              <div className="field cursor-default text-muted-foreground select-all">{feeLine}</div>
              <p className={`hint mt-1.5 tabular ${described.length > 256 ? "!text-destructive" : ""}`}>
                {described.length}/256 · added to the description so anyone reading the token sees who gets paid
              </p>
            </div>
            <div className="section-sep grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Dev buy</label>
                <div className="relative">
                  <input value={devBuy} onChange={(e) => setDevBuy(e.target.value.replace(/[^0-9.]/g, ""))} inputMode="decimal" className="field pr-14 tabular" placeholder="0.00" />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted-foreground">ETH</span>
                </div>
                <p className="hint mt-1.5">Optional. Buys your own token in the launch transaction, before anyone else.</p>
              </div>
              <div>
                <label className="field-label">Creator tax</label>
                <div className="relative">
                  <input value={tax} onChange={(e) => setTax(e.target.value.replace(/[^0-9.]/g, ""))} inputMode="decimal" className="field pr-9 tabular" />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
                <p className="hint mt-1.5">Optional, on top of the 1% trade fee, paid to the creator in full. Max 10%, fixed forever.</p>
              </div>
            </div>
          </div>
        )}

        <div className="section-sep">
          <label className="flex items-start gap-2.5 text-[14px]">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-white" />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="underline underline-offset-4">
                Terms of Use
              </Link>{" "}
              and have read the{" "}
              <Link href="/disclosures" className="underline underline-offset-4">
                Disclosures
              </Link>
              .
            </span>
          </label>
          <div className="mt-4">
            <button type="button" onClick={action} disabled={!!address && onRobinhoodChain && !valid} className={`${btn.primary} h-11 w-full rounded-full text-base`}>
              {actionLabel}
            </button>
          </div>
          {notice && (
            <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm">
              <LockIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <div className="font-medium">{mode === "launch" ? "Launching opens with the fee router" : "Registration opens with the fee router"}</div>
                <div className="text-muted-foreground">
                  Your settings are ready, and nothing was sent. The wallet will be asked to sign here once the Bridge Money contracts are published on {CHAIN.name}.
                </div>
              </div>
            </div>
          )}
          <p className="hint mt-3 text-center">
            By launching you agree to the{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms of Use
            </Link>
            .
          </p>
        </div>
      </div>

      <aside className="border-t border-white/[0.08] bg-black/30 p-5 lg:border-t-0 lg:border-l">
        <div className="space-y-4">
          <div className="card-lift glass rounded-2xl px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="chrome-text text-2xl leading-tight font-semibold tabular">$20.00</div>
                <div className="mt-0.5 flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
                  sent to <span className="truncate font-medium text-foreground">{handle.trim() ? feeTarget(platform, handle) : "Recipient"}</span>
                </div>
                <div className="mt-1 truncate text-[12px] text-muted-foreground">“{feeLine}”</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="relative">
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-label="recipient">
                    <PlatformGlyph platform={platform} className="size-3.5" />
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">first milestone</span>
              </div>
            </div>
          </div>

          <div className="card-lift overflow-hidden rounded-2xl border border-white/10 bg-card/70">
            <div className="p-3">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
                {image ? (
                  <img src={image} alt="" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center text-3xl text-muted-foreground/40">—</div>
                )}
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-1.5 py-0.5 text-[10px] backdrop-blur">
                  <span className="size-1.5 rounded-full bg-success" /> {CHAIN.name}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2 px-0.5">
                <span className={`truncate text-[15px] font-medium ${name ? "" : "text-muted-foreground"}`}>{name || "Token name"}</span>
                <span className="text-[12px] text-muted-foreground">{ticker || "TICKER"}</span>
              </div>
              <div className="mt-1 flex gap-3 px-0.5 text-[13px] tabular">
                <span>
                  <span className="font-semibold">$0</span> <span className="text-muted-foreground">MC</span>
                </span>
                <span>
                  <span className="font-semibold">$0</span> <span className="text-muted-foreground">Sent</span>
                </span>
              </div>
            </div>
            <dl className="divide-y divide-white/[0.08] border-t border-white/[0.08] text-[13px]">
              <Row label={<span className="inline-flex items-center gap-1"><PlatformGlyph platform={platform} /> Fees sent to</span>} value={handle.trim() ? feeTarget(platform, handle) : "—"} />
              <Row label="Recipient share" value={<span className="font-semibold">80%</span>} />
              <Row label="Protocol share" value="20%" />
              <Row label="Trade fee" value={`1% + ${taxValue}% creator tax`} />
              <Row label="Dev buy" value={devBuy ? `${devBuy} ETH` : "None"} />
            </dl>
          </div>
        </div>
        <p className="hint mt-4 leading-relaxed">
          Fees accrue on {CHAIN.name} and are claimed on a schedule. Every claim splits 80/20: the recipient share is paid to the creator in dollars.{" "}
          <Link href="/docs" className="underline underline-offset-4">
            Docs
          </Link>
        </p>
        {agree && valid && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-success">
            <CheckIcon className="size-3.5" /> Ready
          </p>
        )}
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate text-right">{value}</dd>
    </div>
  );
}
