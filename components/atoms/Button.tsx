import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "soft";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-h1 transition-colors disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-secondary hover:bg-michelin-red-500 active:bg-michelin-red-700",
  secondary:
    "bg-secondary text-primary border border-primary hover:bg-michelin-red-50/10 active:bg-michelin-red-50/20",
  soft:
    "bg-michelin-red-50/20 text-primary border border-michelin-red-50/60 hover:bg-michelin-red-50/30 active:bg-michelin-red-50/40",
};

export const Button = ({
  variant = "primary",
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  className = "",
  children,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
  >
    {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
    {children}
    {trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
  </button>
);
