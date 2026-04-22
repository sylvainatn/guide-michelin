import type { ReactNode } from "react";

type PaceCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
};

export const PaceCard = ({
  icon,
  title,
  subtitle,
  selected,
  onClick,
}: PaceCardProps) => {
  const wrapper = selected
    ? "border-primary bg-white"
    : "border-transparent bg-neutral-100";
  const tileBg = selected ? "bg-primary/10" : "bg-white";
  const iconColor = selected ? "text-primary" : "text-neutral-500";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-colors ${wrapper}`}
    >
      <span
        className={`inline-flex size-14 items-center justify-center rounded-full ${tileBg} ${iconColor}`}
      >
        {icon}
      </span>
      <div className="space-y-1">
        <p className="text-[15px] font-bold text-neutral-900">{title}</p>
        <p className="text-xs text-neutral-500 leading-snug">{subtitle}</p>
      </div>
      <span
        className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
          selected
            ? "bg-primary text-white"
            : "bg-white text-neutral-500 ring-1 ring-neutral-200"
        }`}
      >
        {selected ? "Sélectionné" : "Choisir"}
      </span>
    </button>
  );
};
