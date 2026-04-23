"use client";

import type { ReactNode } from "react";

type Props = {
  selected?: boolean;
  onClick?: () => void;
  variant?: "apple" | "google" | "card";
  children: ReactNode;
};

export const PaymentMethodOption = ({
  selected,
  onClick,
  variant = "card",
  children,
}: Props) => {
  const ringClass = selected ? "ring-2 ring-primary ring-offset-2" : "";
  const base = "flex h-14 w-full items-center justify-center rounded-xl text-sm font-medium transition-all";

  if (variant === "apple") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} bg-black text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] ${ringClass}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} border border-neutral-200 bg-neutral-50 text-tertiary ${ringClass}`}
    >
      {children}
    </button>
  );
};
