import { CreatorProfile, creatorMetadata, creatorParams } from "@/components/CreatorProfile";

type Params = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return creatorParams("x").map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Params) {
  return creatorMetadata("x", (await params).handle);
}

export default async function Page({ params }: Params) {
  return <CreatorProfile platform="x" handle={(await params).handle} />;
}
