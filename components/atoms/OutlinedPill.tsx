import type { ReactNode } from "react";

export const OutlinedPill = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
    {children}
  </span>
);
