import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  label: string;
};

export const StepBadge = ({ icon, label }: Props) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-[10px] font-semibold text-primary">
    <span className="inline-flex size-3 items-center justify-center">{icon}</span>
    {label}
  </span>
);
