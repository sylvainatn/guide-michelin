import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "white" | "primary" | "ghost";

type CircleIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md";
  children: ReactNode;
};

const variants: Record<Variant, string> = {
  white: "bg-white/95 text-neutral-900 shadow ring-1 ring-black/5",
  primary: "bg-primary text-white shadow",
  ghost: "bg-white/20 text-white backdrop-blur",
};

export const CircleIconButton = ({
  variant = "white",
  size = "md",
  className = "",
  children,
  ...props
}: CircleIconButtonProps) => {
  const s = size === "sm" ? "size-9" : "size-10";
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex ${s} items-center justify-center rounded-full transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
