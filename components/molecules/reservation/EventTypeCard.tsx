"use client";

import type { ReactNode } from "react";

type Props = {
  label: string;
  icon: ReactNode;
  selected?: boolean;
  onClick?: () => void;
};

export const EventTypeCard = ({ label, icon, selected, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-[100px] flex-1 flex-col items-center justify-center gap-2 rounded-[14px] border p-3 transition-colors ${
      selected
        ? "border-2 border-primary bg-primary/5"
        : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
    }`}
  >
    <span
      className={`flex size-11 items-center justify-center rounded-full ${
        selected
          ? "bg-white shadow-[0_2px_12px_0_rgba(200,16,46,0.13)]"
          : "bg-neutral-100"
      }`}
    >
      <span className={selected ? "text-primary" : "text-neutral-500"}>
        {icon}
      </span>
    </span>
    <span
      className={`text-[13px] font-bold ${
        selected ? "text-primary" : "text-tertiary"
      }`}
    >
      {label}
    </span>
  </button>
);
