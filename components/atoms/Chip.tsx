import type { ButtonHTMLAttributes, ReactNode } from "react";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  children: ReactNode;
};

export const Chip = ({
  selected = false,
  className = "",
  children,
  ...props
}: ChipProps) => {
  const state = selected
    ? "bg-primary text-white border-primary"
    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300";
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${state} ${className}`}
    >
      {children}
    </button>
  );
};
