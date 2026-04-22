import type { ReactNode } from "react";
import { CheckCircleFilledIcon, ChevronRightIcon } from "../atoms/icons";

type Tone = "pink" | "amber" | "green" | "neutral";

const tones: Record<Tone, { bg: string; icon: string; subtitle: string }> = {
  pink: { bg: "bg-primary/10", icon: "text-primary", subtitle: "text-primary/80" },
  amber: {
    bg: "bg-amber-100",
    icon: "text-amber-700",
    subtitle: "text-amber-700/80",
  },
  green: {
    bg: "bg-emerald-100",
    icon: "text-emerald-700",
    subtitle: "text-emerald-700/80",
  },
  neutral: {
    bg: "bg-neutral-100",
    icon: "text-neutral-500",
    subtitle: "text-neutral-500",
  },
};

type Variant = "outline" | "filled";

type SelectableRowProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  tone?: Tone;
  selected?: boolean;
  variant?: Variant;
  onClick?: () => void;
};

export const SelectableRow = ({
  icon,
  title,
  subtitle,
  tone = "neutral",
  selected = false,
  variant = "outline",
  onClick,
}: SelectableRowProps) => {
  const t = tones[tone];

  let wrapper: string;
  let titleColor: string;
  let subtitleColor: string;
  let iconTileBg: string;
  let iconColor: string;
  let trailing: ReactNode;

  if (selected && variant === "filled") {
    wrapper = "bg-primary border-primary";
    titleColor = "text-white";
    subtitleColor = "text-white/80";
    iconTileBg = "bg-white/15";
    iconColor = "text-white";
    trailing = <CheckCircleFilledIcon className="size-6 text-white/90" />;
  } else if (selected && variant === "outline") {
    wrapper = "bg-primary/5 border-primary";
    titleColor = "text-neutral-900";
    subtitleColor = "text-primary/80";
    iconTileBg = "bg-primary/10";
    iconColor = "text-primary";
    trailing = <CheckCircleFilledIcon className="size-6 text-primary" />;
  } else {
    wrapper = "bg-white border-neutral-200";
    titleColor = "text-neutral-900";
    subtitleColor = t.subtitle;
    iconTileBg = t.bg;
    iconColor = t.icon;
    trailing = <ChevronRightIcon className="size-5 text-neutral-300" />;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${wrapper}`}
    >
      <span
        className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl ${iconTileBg} ${iconColor}`}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-[15px] font-bold ${titleColor}`}>{title}</p>
        {subtitle && (
          <p className={`mt-0.5 text-xs ${subtitleColor}`}>{subtitle}</p>
        )}
      </div>
      <span className="shrink-0">{trailing}</span>
    </button>
  );
};
