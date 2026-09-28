"use client";

import { useEffect, useState } from "react";

export type LiveChain = {
  block: number | null;
  gasGwei: number | null;
  ethUsd: number | null;
  readAt: string;
  token: { supply: number | null; burned: number | null };
};

/** Polls the server's chain reader. Returns null until the first answer. */
export function useChain(everyMs = 15_000) {
  const [data, setData] = useState<LiveChain | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch("/api/chain", { cache: "no-store" })
        .then((r) => (r.ok ? (r.json() as Promise<LiveChain>) : Promise.reject(new Error(String(r.status)))))
        .then((d) => {
          if (cancelled) return;
          setData(d);
          setFailed(d.block === null);
        })
        .catch(() => !cancelled && setFailed(true));
    load();
    const timer = window.setInterval(load, everyMs);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [everyMs]);
  return { data, failed };
}
