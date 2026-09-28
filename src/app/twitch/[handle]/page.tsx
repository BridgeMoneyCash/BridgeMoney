import { CreatorProfile, creatorMetadata, creatorParams } from "@/components/CreatorProfile";

type Params = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return creatorParams("twitch").map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Params) {
  return creatorMetadata("twitch", (await params).handle);
}

export default async function Page({ params }: Params) {
  return <CreatorProfile platform="twitch" handle={(await params).handle} />;
}
