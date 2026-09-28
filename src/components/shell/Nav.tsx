"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/config/brand";
import { LogoMark } from "@/components/Logo";
import {
  BanknoteIcon,
  ChartIcon,
  CompassIcon,
  DollarIcon,
  FileTextIcon,
  HomeIcon,
  RocketIcon,
  WorkflowIcon,
} from "@/components/icons";

const ITEMS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/explore", label: "Explore", Icon: CompassIcon },
  { href: "/payments", label: "Payments", Icon: DollarIcon },
  { href: "/analytics", label: "Analytics", Icon: ChartIcon },
  { href: "/launch", label: "Launch", Icon: RocketIcon },
  { href: "/claim", label: "Payout status", Icon: BanknoteIcon },
  { href: "/capital-flow", label: "Capital flow", Icon: WorkflowIcon },
  { href: "/docs", label: "Docs", Icon: FileTextIcon },
];

const MOBILE = ["/", "/explore", "/payments", "/launch", "/claim"];
const SHORT: Record<string, string> = { "/claim": "Payouts" };

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col items-center border-r border-border bg-sidebar py-4 md:flex">
      <Link href="/" aria-label={`${BRAND.name} home`} className="mb-6">
        <LogoMark className="size-9" />
      </Link>
      <nav className="flex flex-col gap-1">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              className={`group relative flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-accent hover:text-foreground ${
                active ? "bg-accent text-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5" />
              <span className="pointer-events-none absolute left-12 z-50 hidden rounded-md border border-border bg-card px-2 py-1 text-xs whitespace-nowrap text-foreground group-hover:block">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
      <a
        href={BRAND.x}
        target="_blank"
        rel="noreferrer"
        aria-label={`${BRAND.name} on X`}
        className="mt-auto flex size-10 items-center justify-center rounded-xl opacity-60 transition-opacity hover:opacity-100"
      >
        <LogoMark className="size-6" />
      </a>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-border bg-background/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {ITEMS.filter((item) => MOBILE.includes(item.href)).map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          aria-label={label}
          className={`flex min-w-0 flex-1 flex-col items-center gap-1 py-2 text-[10px] ${
            isActive(pathname, href) ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          <Icon className="size-5" />
          {SHORT[href] ?? label}
        </Link>
      ))}
    </nav>
  );
}
