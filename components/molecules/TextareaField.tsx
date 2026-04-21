import type { TextareaHTMLAttributes } from "react";
import { Label } from "../atoms/Label";
import { Textarea } from "../atoms/Textarea";

type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value">;

export const TextareaField = ({
  label,
  value,
  onChange,
  ...props
}: TextareaFieldProps) => (
  <label className="block space-y-1.5">
    <Label>{label}</Label>
    <Textarea
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);
