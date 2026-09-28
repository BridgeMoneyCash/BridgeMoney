import { CreatorProfile, creatorMetadata, creatorParams } from "@/components/CreatorProfile";

type Params = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return creatorParams("github").map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Params) {
  return creatorMetadata("github", (await params).handle);
}

export default async function Page({ params }: Params) {
  return <CreatorProfile platform="github" handle={(await params).handle} />;
}
