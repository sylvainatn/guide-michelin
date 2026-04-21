import { Label } from "../atoms/Label";

type Option<T extends string> = {
  value: T;
  label: string;
};

type RadioGroupProps<T extends string> = {
  name: string;
  legend?: string;
  value: T;
  options: ReadonlyArray<Option<T>>;
  onChange: (value: T) => void;
};

export const RadioGroup = <T extends string>({
  name,
  legend,
  value,
  options,
  onChange,
}: RadioGroupProps<T>) => (
  <div className="space-y-2">
    {legend && <Label>{legend}</Label>}
    <div className="flex flex-wrap gap-4 text-sm">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="inline-flex cursor-pointer items-center gap-2"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-primary"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  </div>
);
