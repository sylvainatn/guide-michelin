"use client";

type Tick = { value: number; label: string };

type RangeSliderProps = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  ticks?: Tick[];
};

export const RangeSlider = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  ticks,
}: RangeSliderProps) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-red"
        style={{
          background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${pct}%, #e5e5e5 ${pct}%, #e5e5e5 100%)`,
        }}
      />
      {ticks && (
        <div className="mt-3 flex justify-between text-xs">
          {ticks.map((t) => {
            const active = value >= t.value - 0.5 && value < t.value + 0.5;
            return (
              <span
                key={t.value}
                className={
                  active
                    ? "font-bold text-primary"
                    : "font-medium text-neutral-400"
                }
              >
                {t.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
