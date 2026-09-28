import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Stroke({ children, ...props }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </Stroke>
);
export const CompassIcon = (p: P) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
  </Stroke>
);
export const DollarIcon = (p: P) => (
  <Stroke {...p}>
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </Stroke>
);
export const ChartIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </Stroke>
);
export const ChartLineIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="m19 9-5 5-4-4-3 3" />
  </Stroke>
);
export const RocketIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </Stroke>
);
export const BanknoteIcon = (p: P) => (
  <Stroke {...p}>
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </Stroke>
);
export const WorkflowIcon = (p: P) => (
  <Stroke {...p}>
    <rect width="8" height="8" x="3" y="3" rx="2" />
    <path d="M7 11v4a2 2 0 0 0 2 2h4" />
    <rect width="8" height="8" x="13" y="13" rx="2" />
  </Stroke>
);
export const FileTextIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8M16 13H8M16 17H8" />
  </Stroke>
);
export const SearchIcon = (p: P) => (
  <Stroke {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Stroke>
);
export const ArrowRightIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Stroke>
);
export const ArrowDownIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </Stroke>
);
export const ChevronLeftIcon = (p: P) => (
  <Stroke {...p}>
    <path d="m15 18-6-6 6-6" />
  </Stroke>
);
export const ChevronRightIcon = (p: P) => (
  <Stroke {...p}>
    <path d="m9 18 6-6-6-6" />
  </Stroke>
);
export const ExternalIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </Stroke>
);
export const SwapIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M8 3 4 7l4 4" />
    <path d="M4 7h16" />
    <path d="m16 21 4-4-4-4" />
    <path d="M20 17H4" />
  </Stroke>
);
export const WalletIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </Stroke>
);
export const CopyIcon = (p: P) => (
  <Stroke {...p}>
    <rect width="14" height="14" x="8" y="8" rx="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </Stroke>
);
export const CheckIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Stroke>
);
export const ImagePlusIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M16 5h6M19 2v6" />
    <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    <circle cx="9" cy="9" r="2" />
  </Stroke>
);
export const LoaderIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </Stroke>
);
export const CloseIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Stroke>
);
export const LogOutIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </Stroke>
);
export const LockIcon = (p: P) => (
  <Stroke {...p}>
    <rect width="18" height="11" x="3" y="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Stroke>
);
export const BridgeIcon = (p: P) => (
  <Stroke {...p}>
    <path d="M3 16h18" />
    <path d="M4 16c1.5-5 4.5-7.5 8-7.5s6.5 2.5 8 7.5" />
    <path d="M8 16v-4.6M12 16V8.5M16 16v-4.6" />
  </Stroke>
);

/** Four-point sparkle used on the hero card corners. */
export const SparkleIcon = (p: P) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M8 0c.4 3.9 1.8 5.6 8 8-6.2 2.4-7.6 4.1-8 8-.4-3.9-1.8-5.6-8-8 6.2-2.4 7.6-4.1 8-8Z" />
  </svg>
);

/* Platform glyphs. Solid, drawn in currentColor unless a brand tint is asked for. */
export const XIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);
export const GithubIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
export const TwitchIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0 1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);
export const SpotifyIcon = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="12" fill="currentColor" />
    <g fill="none" stroke="#070707" strokeLinecap="round">
      <path d="M5.6 8.9c4.3-1.3 9.2-.9 12.9 1.2" strokeWidth="2.1" />
      <path d="M6.3 12.5c3.6-1 7.6-.6 10.6 1.1" strokeWidth="1.8" />
      <path d="M6.9 15.8c2.9-.8 5.9-.5 8.4.9" strokeWidth="1.5" />
    </g>
  </svg>
);
/** The self-custody option: payouts pushed to a wallet the creator already uses. */
export const WalletGlyph = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M4 4.5A2.5 2.5 0 0 0 1.5 7v10A2.5 2.5 0 0 0 4 19.5h16a2.5 2.5 0 0 0 2.5-2.5v-1.5H17a3.5 3.5 0 0 1 0-7h5.5V7A2.5 2.5 0 0 0 20 4.5Z" />
    <path d="M17 10.5a1.5 1.5 0 0 0 0 3h5.5v-3Z" />
  </svg>
);
export const VerifiedIcon = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path
      className="fill-x-blue"
      d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34Z"
    />
    <path d="m10.54 16.2-3.6-3.6 1.41-1.41 2.19 2.18 4.82-4.82 1.41 1.42Z" fill="#fff" />
  </svg>
);
