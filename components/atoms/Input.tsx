import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className = "", ...props }: InputProps) => (
  <input
    {...props}
    className={`w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none ${className}`}
  />
);
