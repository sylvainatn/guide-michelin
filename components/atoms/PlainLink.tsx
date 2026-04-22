import Link from "next/link";
import type { ReactNode } from "react";

export const PlainLink = ({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <Link
    href={href}
    className={`text-h1 text-primary underline underline-offset-4 ${className}`}
  >
    {children}
  </Link>
);
