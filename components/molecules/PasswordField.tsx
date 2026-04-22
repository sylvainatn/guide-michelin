"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon, LockIcon } from "../atoms/icons";
import { IconInput } from "../atoms/IconInput";

type PasswordFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  valid?: boolean;
};

export const PasswordField = ({
  value,
  onChange,
  placeholder = "Mot de passe",
  autoComplete = "current-password",
  required,
  minLength,
  valid = false,
}: PasswordFieldProps) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <IconInput
      type={revealed ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      minLength={minLength}
      valid={valid}
      leadingIcon={<LockIcon className="size-5" />}
      trailingAction={
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-label={
            revealed ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
          className="p-1 text-neutral-400 hover:text-neutral-600"
        >
          {revealed ? (
            <EyeOffIcon className="size-5" />
          ) : (
            <EyeIcon className="size-5" />
          )}
        </button>
      }
    />
  );
};
