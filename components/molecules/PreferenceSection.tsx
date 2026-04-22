import type { ReactNode } from "react";
import { InfoIcon } from "../atoms/icons";

export const PreferenceSection = ({
  title,
  info = false,
  withDivider = true,
  children,
}: {
  title: string;
  info?: boolean;
  withDivider?: boolean;
  children: ReactNode;
}) => (
  <section className={withDivider ? "border-b border-neutral-200 pb-5" : ""}>
    <div className="mb-3 flex items-center gap-2">
      <h3 className="text-[15px] font-semibold text-tertiary">{title}</h3>
      {info && <InfoIcon className="h-4 w-4 text-primary" />}
    </div>
    <div className="flex flex-wrap gap-2">{children}</div>
  </section>
);
