import type { InputHTMLAttributes, ReactNode } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
};

export const Checkbox = ({ label, className = "", ...props }: CheckboxProps) => (
  <label className={`inline-flex cursor-pointer items-center gap-2 text-sm text-neutral-700 ${className}`}>
    <input
      type="checkbox"
      {...props}
      className="size-4 shrink-0 appearance-none rounded-sm border border-primary bg-white checked:border-primary checked:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    />
    {label && <span>{label}</span>}
  </label>
);
