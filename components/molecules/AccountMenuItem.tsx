import Link from "next/link";
import type { ReactNode } from "react";
import { CircleIconBubble } from "../atoms/CircleIconBubble";
import { ChevronRightIcon } from "../atoms/icons";

type Tone = "red" | "blue" | "green";

export const AccountMenuItem = ({
  href,
  icon,
  label,
  count,
  tone = "red",
}: {
  href: string;
  icon: ReactNode;
  label: string;
  count?: number;
  tone?: Tone;
}) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-neutral-50"
  >
    <CircleIconBubble tone={tone} icon={icon} />
    <span className="flex-1 text-[14px] font-medium text-tertiary">
      {label}
    </span>
    {typeof count === "number" && count > 0 && (
      <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
        {count}
      </span>
    )}
    <ChevronRightIcon className="h-4 w-4 text-neutral-400" />
  </Link>
);
