import type { ReactNode } from "react";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "size-9 rounded-xl",
  md: "size-12 rounded-xl",
  lg: "size-14 rounded-2xl",
};

export const IconTile = ({
  children,
  size = "md",
  className = "",
}: {
  children: ReactNode;
  size?: Size;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center justify-center bg-primary/10 text-primary ${sizes[size]} ${className}`}
  >
    {children}
  </span>
);
