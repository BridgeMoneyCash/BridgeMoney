import { CreatorProfile, creatorMetadata, creatorParams } from "@/components/CreatorProfile";

type Params = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return creatorParams("wallet").map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Params) {
  return creatorMetadata("wallet", (await params).handle);
}

export default async function Page({ params }: Params) {
  return <CreatorProfile platform="wallet" handle={(await params).handle} />;
}
