import Link from "next/link";

export const BackLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} className="text-sm text-neutral-500 underline">
    ← {children}
  </Link>
);
