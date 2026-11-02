// The site mark: a recursion tree (one problem split into two). Same drawing as app/icon.svg.
export function Logo({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      <rect width="64" height="64" rx="14" fill="#141110" />
      <path d="M32 19 L17 45 M32 19 L47 45" stroke="#ede6d6" strokeWidth="5" strokeLinecap="round" />
      <circle cx="32" cy="18" r="9" fill="#ff5a1f" />
      <circle cx="17" cy="46" r="8" fill="#e8b23a" />
      <circle cx="47" cy="46" r="8" fill="#e8b23a" />
    </svg>
  );
}
