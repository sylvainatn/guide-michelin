export const StepProgressBar = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => (
  <div className="flex w-full items-center gap-1.5">
    {Array.from({ length: total }, (_, i) => (
      <span
        key={i}
        className={`h-1 flex-1 rounded-full ${
          i < current ? "bg-primary" : "bg-neutral-200"
        }`}
      />
    ))}
  </div>
);
