import type { InputHTMLAttributes, ReactNode } from "react";
import { CheckIcon } from "./icons";

type IconInputProps = InputHTMLAttributes<HTMLInputElement> & {
  leadingIcon?: ReactNode;
  trailingAction?: ReactNode;
  valid?: boolean;
};

export const IconInput = ({
  leadingIcon,
  trailingAction,
  valid = false,
  className = "",
  ...props
}: IconInputProps) => {
  const validBorder = "border-green-500 ring-2 ring-green-500/20";
  const focusBorder =
    "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20";
  const wrapper = valid
    ? `border bg-white ${validBorder}`
    : `border border-neutral-200 bg-white ${focusBorder}`;
  return (
    <div
      className={`relative flex w-full items-center rounded-xl px-3 transition-colors ${wrapper} ${className}`}
    >
      {leadingIcon && (
        <span
          className={`mr-2 flex size-5 shrink-0 items-center justify-center ${
            valid ? "text-green-600" : "text-primary"
          }`}
        >
          {leadingIcon}
        </span>
      )}
      <input
        {...props}
        className="h-11 w-full flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
      />
      {trailingAction ? (
        <span className="ml-2 flex shrink-0 items-center text-neutral-400">
          {trailingAction}
        </span>
      ) : valid ? (
        <CheckIcon className="ml-2 size-5 shrink-0 text-green-600" />
      ) : null}
    </div>
  );
};
