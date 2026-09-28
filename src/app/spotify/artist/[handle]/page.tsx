import { CreatorProfile, creatorMetadata, creatorParams } from "@/components/CreatorProfile";

type Params = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return creatorParams("spotify").map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Params) {
  return creatorMetadata("spotify", (await params).handle);
}

export default async function Page({ params }: Params) {
  return <CreatorProfile platform="spotify" handle={(await params).handle} />;
}
