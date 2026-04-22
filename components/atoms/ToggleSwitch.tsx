"use client";

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel?: string;
  disabled?: boolean;
};

export const ToggleSwitch = ({
  checked,
  onChange,
  ariaLabel,
  disabled = false,
}: Props) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
      checked ? "bg-primary" : "bg-neutral-300"
    }`}
  >
    <span
      className={`inline-block size-5 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);
