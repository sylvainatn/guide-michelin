import { CameraIcon, ClockIcon, PinIcon, StarFilledIcon } from "../atoms/icons";

type Props = {
  name: string;
  mediaUrl: string | null;
  stars: number | null;
  priceFromEur: number | null;
  tripDuration: string | null;
  partnerBadge: string | null;
  locationLabel: string | null;
  fallbackLocation: string;
};

const Pill = ({
  icon,
  children,
  variant = "dark",
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: "dark" | "light";
}) => {
  const tone =
    variant === "dark"
      ? "bg-neutral-900/90 text-white"
      : "bg-white/95 text-tertiary";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium shadow-sm ${tone}`}
    >
      {icon}
      {children}
    </span>
  );
};

export const RestaurantDetailHero = ({
  name,
  mediaUrl,
  stars,
  priceFromEur,
  tripDuration,
  partnerBadge,
  locationLabel,
  fallbackLocation,
}: Props) => {
  const showStarBadge = typeof stars === "number" && stars > 0;
  const starLabel =
    stars === 1 ? "1 Étoile Michelin" : `${stars} Étoiles Michelin`;

  return (
    <section className="relative overflow-hidden rounded-3xl">
      {mediaUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={mediaUrl}
          alt={name}
          className="h-[320px] w-full object-cover"
        />
      ) : (
        <div className="h-[320px] w-full bg-linear-to-br from-michelin-red-300 to-tertiary" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/35" />

      <div className="absolute inset-x-0 top-3 flex items-center justify-between gap-2 px-3">
        {priceFromEur !== null && (
          <Pill icon={<CameraIcon className="size-3.5" />}>
            À partir de {priceFromEur} € / pers.
          </Pill>
        )}
        {tripDuration && (
          <Pill icon={<ClockIcon className="size-3.5" />} variant="light">
            {tripDuration}
          </Pill>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-4 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {showStarBadge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[12px] font-semibold text-white shadow">
              <StarFilledIcon className="size-3.5" />
              {starLabel}
            </span>
          )}
          {partnerBadge && (
            <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-[12px] font-medium text-tertiary">
              {partnerBadge}
            </span>
          )}
        </div>
        <h1 className="font-serif text-4xl font-bold leading-tight text-white drop-shadow-lg">
          {name}
        </h1>
        <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/90">
          <PinIcon className="size-3.5" />
          <span>{locationLabel ?? fallbackLocation}</span>
        </p>
      </div>
    </section>
  );
};
