import type { ReactNode } from "react";
import { Heading } from "../atoms/Heading";
import { MutedText } from "../atoms/MutedText";

export const PageHeader = ({
  title,
  subtitle,
  align = "left",
}: {
  title: string;
  subtitle?: ReactNode;
  align?: "left" | "center";
}) => (
  <header
    className={`space-y-2 ${align === "center" ? "text-center" : ""}`}
  >
    <Heading>{title}</Heading>
    {subtitle && <MutedText align={align}>{subtitle}</MutedText>}
  </header>
);
