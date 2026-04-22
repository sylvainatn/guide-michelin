import type { ReactNode } from "react";
import { InfoIcon } from "../atoms/icons";

type Tone = "success" | "info";

type Props = {
  tone?: Tone;
  children: ReactNode;
};

const TONES: Record<Tone, { wrapper: string; icon: string }> = {
  success: {
    wrapper: "border-[#a8d5bd] bg-[#eef7f1] text-[#2f8a5c]",
    icon: "text-[#2f8a5c]",
  },
  info: {
    wrapper: "border-neutral-200 bg-neutral-50 text-neutral-600",
    icon: "text-primary",
  },
};

export const InfoBanner = ({ tone = "success", children }: Props) => {
  const t = TONES[tone];
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[12px] leading-snug ${t.wrapper}`}
    >
      <InfoIcon className={`mt-0.5 size-4 shrink-0 ${t.icon}`} />
      <p>{children}</p>
    </div>
  );
};
