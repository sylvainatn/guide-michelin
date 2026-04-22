import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "../atoms/icons";

type BaseProps = {
  icon: ReactNode;
  label: string;
};

type NavProps = BaseProps & {
  href: string;
};

type ToggleProps = BaseProps & {
  trailing: ReactNode;
};

const shell =
  "flex w-full items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-left text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-300";

const IconSlot = ({ children }: { children: ReactNode }) => (
  <span className="flex size-8 items-center justify-center text-neutral-700">
    {children}
  </span>
);

export const SecurityNavRow = ({ icon, label, href }: NavProps) => (
  <Link href={href} className={shell}>
    <IconSlot>{icon}</IconSlot>
    <span className="flex-1">{label}</span>
    <ChevronRightIcon className="size-4 text-neutral-400" />
  </Link>
);

export const SecurityToggleRow = ({ icon, label, trailing }: ToggleProps) => (
  <div className={shell}>
    <IconSlot>{icon}</IconSlot>
    <span className="flex-1">{label}</span>
    {trailing}
  </div>
);
