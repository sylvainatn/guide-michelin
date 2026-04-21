import Link from "next/link";

export const AuthFooterLink = ({
  question,
  linkLabel,
  href,
}: {
  question: string;
  linkLabel: string;
  href: string;
}) => (
  <p className="text-center text-sm text-neutral-500">
    {question}{" "}
    <Link href={href} className="text-black underline">
      {linkLabel}
    </Link>
  </p>
);
