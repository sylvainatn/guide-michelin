import { TIERS, type TierKey } from "../../lib/loyalty/tiers";

export const TierStepper = ({ currentKey }: { currentKey: TierKey }) => {
  const currentIdx = TIERS.findIndex((t) => t.key === currentKey);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        {TIERS.map((tier, idx) => {
          const reached = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={tier.key} className="flex flex-1 items-center last:flex-none">
              <span
                className={`block size-2.5 rounded-full ${
                  reached ? "bg-primary" : "bg-neutral-300"
                } ${isCurrent ? "ring-4 ring-primary/15" : ""}`}
              />
              {idx < TIERS.length - 1 && (
                <span
                  className={`h-0.5 flex-1 ${
                    idx < currentIdx ? "bg-primary" : "bg-neutral-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[11px] font-medium">
        {TIERS.map((tier, idx) => (
          <span
            key={tier.key}
            className={idx <= currentIdx ? "text-primary" : "text-neutral-400"}
          >
            {tier.label}
          </span>
        ))}
      </div>
    </div>
  );
};
