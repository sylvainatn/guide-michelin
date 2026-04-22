import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

const CubeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
    <path
      d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3z M3 7.5 12 12l9-4.5 M12 12v9"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Tour3DButton = ({
  label = "Vue 3D",
  className = "",
  ...rest
}: Props) => (
  <button
    type="button"
    {...rest}
    className={`inline-flex flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-200 bg-secondary px-4 py-3 text-tertiary shadow-sm transition-colors hover:border-primary hover:text-primary ${className}`}
  >
    <CubeIcon />
    <span className="text-h2 font-medium">{label}</span>
  </button>
);
