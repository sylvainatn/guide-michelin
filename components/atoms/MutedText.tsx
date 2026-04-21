import type { ReactNode } from "react";

export const MutedText = ({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "center";
}) => (
  <p
    className={`text-sm text-neutral-500 ${align === "center" ? "text-center" : ""}`}
  >
    {children}
  </p>
);
