import type { ReactNode } from "react";

type Tone = "red" | "blue" | "green";

const tones: Record<Tone, string> = {
  red: "bg-[#fbe4e9] text-primary",
  blue: "bg-[#e4ecfb] text-[#3b5fa5]",
  green: "bg-[#e4f3ec] text-[#2f8a5c]",
};

export const CircleIconBubble = ({
  icon,
  tone = "red",
  size = "md",
}: {
  icon: ReactNode;
  tone?: Tone;
  size?: "sm" | "md";
}) => (
  <span
    className={`flex shrink-0 items-center justify-center rounded-xl ${
      size === "sm" ? "size-8" : "size-9"
    } ${tones[tone]}`}
  >
    {icon}
  </span>
);
