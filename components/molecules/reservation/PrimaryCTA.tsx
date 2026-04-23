"use client";

import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/atoms/icons";

type Props = {
  onClick?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export const PrimaryCTA = ({
  onClick,
  children,
  icon,
  disabled,
  className = "",
}: Props) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-bold text-white shadow-[0_4px_20px_0_rgba(200,16,46,0.19)] transition-opacity disabled:opacity-50 ${className}`}
  >
    {children}
    {icon ?? <ArrowRightIcon className="size-4" />}
  </button>
);
