import type { ReactNode } from "react";

type SelectableCardProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  selected?: boolean;
  onClick?: () => void;
};

export const SelectableCard = ({
  icon,
  title,
  subtitle,
  selected = false,
  onClick,
}: SelectableCardProps) => {
  const wrapper = selected
    ? "bg-white border-primary ring-1 ring-primary"
    : "bg-neutral-100 border-transparent";
  const iconColor = selected ? "text-primary" : "text-neutral-500";
  const subtitleColor = selected ? "text-primary" : "text-neutral-500";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex aspect-[1.1] flex-col justify-between rounded-2xl border-2 p-4 text-left transition-colors ${wrapper}`}
    >
      {selected && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          Sélectionné
        </span>
      )}
      <span className={`inline-flex ${iconColor}`}>{icon}</span>
      <div>
        <p className="text-[15px] font-bold text-neutral-900">{title}</p>
        {subtitle && (
          <p className={`mt-0.5 text-xs ${subtitleColor}`}>{subtitle}</p>
        )}
      </div>
    </button>
  );
};
