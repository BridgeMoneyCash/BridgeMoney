import Link from "next/link";
import { BRAND, CHAIN } from "@/config/brand";
import { LogoMark } from "@/components/Logo";
import { CaBlock } from "@/components/CopyCa";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/explore", label: "Explore" },
      { href: "/payments", label: "Payments" },
      { href: "/analytics", label: "Analytics" },
      { href: "/launch", label: "Launch" },
      { href: "/claim", label: "Payout status" },
    ],
  },
  {
    title: "Protocol",
    links: [
      { href: "/capital-flow", label: "Capital flow" },
      { href: "/docs", label: "Docs" },
      { href: CHAIN.explorer, label: "Robinhood Chain" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/disclosures", label: "Disclosures" },
      { href: "/opt-out", label: "Opt out" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border pb-20 md:pb-0">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <LogoMark className="size-6" />
            {BRAND.name}
          </div>
          <p className="text-sm text-muted-foreground">{BRAND.slogan}.</p>
          <CaBlock />
          <p className="text-xs text-muted-foreground">
            © 2026 {BRAND.display}. Independent project, not affiliated with Robinhood or any platform named on this site.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <div className="mb-3 text-sm font-medium">{column.title}</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {column.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("http") ? (
                    <a href={link.href} target="_blank" rel="noreferrer" className="hover:text-foreground">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="hover:text-foreground">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
