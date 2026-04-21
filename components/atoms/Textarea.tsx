import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = ({ className = "", ...props }: TextareaProps) => (
  <textarea
    {...props}
    className={`w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none ${className}`}
  />
);
