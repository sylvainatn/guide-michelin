import { StarFilledIcon } from "./icons";

export const MichelinBadge = ({ stars }: { stars: number }) => {
  const label = `${stars} Étoile${stars > 1 ? "s" : ""} Michelin`;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">
      <StarFilledIcon className="size-3.5" />
      {label}
    </span>
  );
};
