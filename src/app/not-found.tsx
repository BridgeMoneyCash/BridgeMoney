import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { btn } from "@/lib/ui";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card/40 px-6 py-24 text-center">
      <LogoMark className="size-12" />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Nothing on this span</h1>
      <p className="mt-2 max-w-md text-muted-foreground">The page you asked for does not exist, or the token has not been indexed yet.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className={`${btn.primary} ${btn.md} px-4`}>
          Home
        </Link>
        <Link href="/explore" className={`${btn.outline} ${btn.md} px-4`}>
          Explore launches
        </Link>
      </div>
    </div>
  );
}
