import type { ReactNode } from "react";

type Tone = "blue" | "green" | "amber" | "neutral";

const tones: Record<Tone, { bg: string; icon: string; subtitle: string }> = {
  blue: { bg: "bg-sky-50", icon: "text-sky-600", subtitle: "text-sky-700/80" },
  green: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    subtitle: "text-emerald-700/80",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    subtitle: "text-amber-700/80",
  },
  neutral: {
    bg: "bg-neutral-100",
    icon: "text-neutral-500",
    subtitle: "text-neutral-500",
  },
};

type SelectableCardProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  tone?: Tone;
  selected?: boolean;
  onClick?: () => void;
};

export const SelectableCard = ({
  icon,
  title,
  subtitle,
  tone = "neutral",
  selected = false,
  onClick,
}: SelectableCardProps) => {
  const t = tones[tone];
  const wrapper = selected
    ? "bg-white border-primary ring-1 ring-primary"
    : `${t.bg} border-transparent`;
  const iconColor = selected ? "text-primary" : t.icon;
  const subtitleColor = selected ? "text-primary" : t.subtitle;
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
