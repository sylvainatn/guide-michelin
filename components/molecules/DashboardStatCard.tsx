import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string | number;
  icon: ReactNode;
  hint?: string;
};

export const DashboardStatCard = ({ label, value, icon, hint }: Props) => (
  <div className="flex items-start justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-5">
    <div className="min-w-0 flex-1">
      <p className="text-[12px] font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl font-bold text-tertiary">
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-[11px] text-neutral-400">{hint}</p>
      )}
    </div>
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fbe4e9] text-primary">
      {icon}
    </span>
  </div>
);
