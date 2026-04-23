"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
};

export const DashboardNavItem = ({ href, icon, label, active = false }: Props) => {
  const base =
    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors";
  const tone = active
    ? "bg-primary text-white"
    : "text-neutral-700 hover:bg-neutral-100";
  const iconTone = active
    ? "text-white"
    : "text-neutral-400 group-hover:text-neutral-600";

  return (
    <Link href={href} className={`${base} ${tone}`}>
      <span className={`flex size-5 items-center justify-center ${iconTone}`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};
