export const NumberDisplay = ({
  value,
  unit,
}: {
  value: string | number;
  unit: string;
}) => (
  <div className="flex items-baseline justify-center gap-1">
    <span className="text-6xl font-bold tracking-tight text-primary">{value}</span>
    <span className="text-lg font-medium text-neutral-400">{unit}</span>
  </div>
);
