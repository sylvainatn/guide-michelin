import type { ReactNode } from "react";

type Variant = "primary" | "neutral";

type BadgeProps = {
  children: ReactNode;
  variant?: Variant;
  leadingIcon?: ReactNode;
};

const base =
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-h2 font-medium whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-secondary",
  neutral: "bg-neutral-100 text-tertiary",
};

export const Badge = ({ children, variant = "neutral", leadingIcon }: BadgeProps) => (
  <span className={`${base} ${variants[variant]}`}>
    {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
    {children}
  </span>
);
