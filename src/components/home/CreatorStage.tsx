"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Creator, Platform } from "@/config/seed";
import { ChevronRightIcon } from "@/components/icons";
import { Avatar, PlatformGlyph } from "@/components/ui/Art";

export type StageEntry = { creator: Creator; label: string; href: string; platform: string; sent: string };

const SHOW_PLATFORM: Partial<Record<Platform, boolean>> = { spotify: true, twitch: true, github: true, wallet: true };

/** Fanned deck of creator cards. The front card advances on a timer, on the arrows, or on a click. */
export function CreatorStage({ entries }: { entries: StageEntry[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = entries.length;
  const step = useCallback((d: number) => setActive((a) => (a + d + n) % n), [n]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => step(1), 4800);
    return () => window.clearInterval(timer);
  }, [paused, step]);

  const current = entries[active];

  return (
    <div className="creator-stage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        className="stage-floor"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        <div className="stage-depth" role="group" aria-label="Creators paid through Bridge Money">
          {entries.map((entry, i) => {
            const offset = ((i - active + n + Math.floor(n / 2)) % n) - Math.floor(n / 2);
            return (
              <button key={entry.creator.id} type="button" className="stage-card" data-offset={offset} aria-label={`Show ${entry.label}`} onClick={() => setActive(i)}>
                <span className="stage-card-body">
                  <span className="stage-card-face">
                    <span className="stage-card-top">
                      <span className="inline-flex items-center gap-1.5">
                        <PlatformGlyph platform={entry.creator.platform} className="size-3.5" tinted />
                        {SHOW_PLATFORM[entry.creator.platform] ? entry.platform : null}
                      </span>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                    </span>
                    <span className="stage-card-emblem">
                      <span className="stage-avatar block">
                        <Avatar creator={entry.creator} className="block size-full" />
                      </span>
                    </span>
                    <span className="stage-card-foot">
                      <strong>{entry.creator.name}</strong>
                      <span>
                        <b className="tabular">{entry.sent}</b> sent
                      </span>
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="stage-controls">
        <p className="stage-counter">
          <b>{String(active + 1).padStart(2, "0")}</b> / {n}
        </p>
        <div className="stage-arrows">
          <button type="button" aria-label="Previous creator" onClick={() => step(-1)}>
            <ChevronRightIcon className="size-3.5 rotate-180" />
          </button>
          <button type="button" aria-label="Next creator" onClick={() => step(1)}>
            <ChevronRightIcon className="size-3.5" />
          </button>
        </div>
      </div>
      <Link href={current.href} className="stage-jump">
        <b>{current.label}</b>
        <span className="inline-flex items-center gap-1">
          <PlatformGlyph platform={current.creator.platform} className="size-3" tinted /> {current.creator.platform === "x" ? null : current.platform}
        </span>
        <i>→</i>
      </Link>
    </div>
  );
}
