import type { ReactNode } from "react";

export const Label = ({ children }: { children: ReactNode }) => (
  <span className="text-h2 text-neutral-700">{children}</span>
);
