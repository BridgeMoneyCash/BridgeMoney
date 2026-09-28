import type { ReactNode } from "react";

export function Legal({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="prose-doc max-w-3xl">
      <div className="eyebrow">Legal</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      {updated && <p className="text-muted-foreground">Last updated {updated}</p>}
      {children}
    </div>
  );
}
