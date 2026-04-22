import type { ButtonHTMLAttributes, ReactNode } from "react";

type Tone = "red" | "green";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
};

const selectedStyles: Record<Tone, string> = {
  red: "bg-primary text-white border-primary",
  green: "bg-[#e4f3ec] text-[#2f8a5c] border-[#9bd3b4]",
};

export const PreferenceChip = ({
  selected = false,
  tone = "red",
  icon,
  className = "",
  children,
  ...props
}: Props) => {
  const state = selected
    ? selectedStyles[tone]
    : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300";
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${state} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};
