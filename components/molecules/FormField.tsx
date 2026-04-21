import type { InputHTMLAttributes } from "react";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";

type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

export const FormField = ({
  label,
  value,
  onChange,
  ...props
}: FormFieldProps) => (
  <label className="block space-y-1.5">
    <Label>{label}</Label>
    <Input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);
