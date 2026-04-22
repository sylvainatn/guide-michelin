import type { ReactNode } from "react";

type Tone = "pink" | "blue" | "green" | "amber" | "orange";

const tones: Record<Tone, string> = {
  pink: "bg-primary/10 text-primary",
  blue: "bg-sky-100 text-sky-700",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  orange: "bg-orange-100 text-orange-700",
};

export const CategoryBadge = ({
  icon,
  children,
  tone = "pink",
}: {
  icon?: ReactNode;
  children: ReactNode;
  tone?: Tone;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${tones[tone]}`}
  >
    {icon}
    {children}
  </span>
);
