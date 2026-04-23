"use client";

import type { ReactNode } from "react";
import { StepHeader } from "@/components/molecules/StepHeader";

type Props = {
  current: number;
  total?: number;
  onBack?: () => void;
  onClose?: () => void;
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  bodyClassName?: string;
};

export const ReservationShell = ({
  current,
  total = 5,
  onBack,
  onClose,
  header,
  children,
  footer,
  bodyClassName = "",
}: Props) => (
  <main className="flex min-h-screen items-start justify-center bg-neutral-100 py-6 md:py-10">
    <div className="relative w-full max-w-[390px] overflow-hidden rounded-[20px] bg-white shadow-[0_8px_40px_0_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-4 px-6 pt-13 pb-6">
        <StepHeader
          current={current}
          total={total}
          onBack={onBack}
          onClose={onClose}
        />
        {header}
      </div>

      <div className={`px-6 pb-28 ${bodyClassName}`}>{children}</div>

      {footer && (
        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2.5 px-6 pb-12">
          {footer}
        </div>
      )}
    </div>
  </main>
);
