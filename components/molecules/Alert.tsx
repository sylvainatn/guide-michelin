import type { ReactNode } from "react";
import { CheckIcon } from "../atoms/icons";

type Tone = "success";

const tones: Record<Tone, { wrap: string; icon: string; title: string }> = {
  success: {
    wrap: "border-green-200 bg-green-50",
    icon: "text-green-600",
    title: "text-green-700",
  },
};

export const Alert = ({
  title,
  children,
  tone = "success",
}: {
  title: ReactNode;
  children?: ReactNode;
  tone?: Tone;
}) => {
  const t = tones[tone];
  return (
    <div
      role="status"
      className={`flex gap-3 rounded-xl border p-4 ${t.wrap}`}
    >
      <CheckIcon className={`mt-0.5 size-5 shrink-0 ${t.icon}`} />
      <div className="space-y-1 text-sm">
        <p className={`font-semibold ${t.title}`}>{title}</p>
        {children && <p className="text-neutral-600">{children}</p>}
      </div>
    </div>
  );
};
