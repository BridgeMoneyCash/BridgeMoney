/* Small dependency-free SVG charts. Values are plotted as given; labels are
   drawn by the caller underneath so they stay in the page's own type. */

export function Sparkline({ values, className = "h-14 w-full" }: { values: number[]; className?: string }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const w = 200;
  const h = 56;
  const pts = values.map((v, i) => [(i / Math.max(values.length - 1, 1)) * w, h - 4 - ((v - min) / (max - min || 1)) * (h - 10)]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="url(#spark-fill)" />
      <path d={line} fill="none" stroke="#e6e7ea" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function LineChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 1) * 1.1;
  const w = 600;
  const h = 150;
  const pts = values.map((v, i) => [(i / Math.max(values.length - 1, 1)) * w, h - (v / max) * h]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-[150px] w-full" role="img" aria-label="Daily fees">
        <defs>
          <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="rgb(255 255 255 / 0.06)" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="url(#line-fill)" />
        <path d={line} fill="none" stroke="#e6e7ea" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
      </svg>
      <AxisLabels labels={labels} />
    </div>
  );
}

export function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 1);
  return (
    <div>
      <div className="flex h-[150px] items-end gap-1.5" role="img" aria-label="Daily launches">
        {values.map((v, i) => (
          <div key={i} className="flex h-full flex-1 flex-col justify-end" title={`${labels[i]}: ${v}`}>
            <div className="rounded-t-md bg-[#dfe1e5] transition-opacity hover:opacity-80" style={{ height: `${Math.max((v / max) * 100, 2)}%` }} />
          </div>
        ))}
      </div>
      <AxisLabels labels={labels} />
    </div>
  );
}

function AxisLabels({ labels }: { labels: string[] }) {
  return (
    <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
      {labels.map((l, i) => (
        <span key={l} className={i % 2 ? "invisible sm:visible" : ""}>
          {l}
        </span>
      ))}
    </div>
  );
}
