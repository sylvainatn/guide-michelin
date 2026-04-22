import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  score: number;
};

export const CriteriaRow = ({ icon, title, subtitle, score }: Props) => {
  const pct = Math.max(0, Math.min(100, (score / 10) * 100));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fbe4e9] text-primary">
          {icon}
        </span>
        <div className="flex-1">
          <h4 className="text-[14px] font-semibold leading-tight text-tertiary">
            {title}
          </h4>
          <p className="mt-0.5 text-[12px] leading-snug text-neutral-500">
            {subtitle}
          </p>
        </div>
        <span className="font-serif text-2xl font-bold leading-none text-primary">
          {score.toFixed(1)}
        </span>
      </div>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
