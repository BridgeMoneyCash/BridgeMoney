import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";
import { CREATORS, TOKENS, creatorPath } from "@/config/seed";

const PAGES = ["", "/explore", "/payments", "/analytics", "/launch", "/claim", "/capital-flow", "/docs", "/terms", "/privacy", "/disclosures", "/opt-out"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((p) => ({ url: `${BRAND.url}${p}` })),
    ...TOKENS.map((t) => ({ url: `${BRAND.url}/token/${t.address}` })),
    ...CREATORS.map((c) => ({ url: `${BRAND.url}${creatorPath(c)}` })),
  ];
}
