import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

const PanoramaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
    <ellipse cx="12" cy="12" rx="9" ry="9" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M3 12c2-3 5-5 9-5s7 2 9 5M3 12c2 3 5 5 9 5s7-2 9-5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const Tour3DButton = ({
  label = "Vue 360°",
  className = "",
  ...rest
}: Props) => (
  <button
    type="button"
    {...rest}
    className={`inline-flex flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-200 bg-secondary px-4 py-3 text-tertiary shadow-sm transition-colors hover:border-primary hover:text-primary ${className}`}
  >
    <PanoramaIcon />
    <span className="text-h2 font-medium">{label}</span>
  </button>
);
