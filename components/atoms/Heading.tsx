import type { ReactNode } from "react";

export const Heading = ({ children }: { children: ReactNode }) => (
  <h1 className="text-2xl font-semibold">{children}</h1>
);
