import type { ReactNode } from "react";

export const FieldLabel = ({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className="mb-1.5 block text-sm font-semibold text-neutral-900"
  >
    {children}
  </label>
);
