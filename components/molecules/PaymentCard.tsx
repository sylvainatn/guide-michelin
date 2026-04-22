import type { ReactNode } from "react";
import { TrashIcon } from "../atoms/icons";

export type PaymentCardVariant = "dark" | "primary";

type Props = {
  variant: PaymentCardVariant;
  brand: ReactNode;
  last4: string;
  holder: string;
  expiry: string;
  badge?: string;
  onDelete?: () => void;
};

const formatMasked = (last4: string) => `•••• •••• •••• ${last4}`;

export const PaymentCard = ({
  variant,
  brand,
  last4,
  holder,
  expiry,
  badge,
  onDelete,
}: Props) => {
  const base =
    "relative flex flex-col gap-6 rounded-2xl px-5 py-5 text-white shadow-lg";
  const tone =
    variant === "dark"
      ? "bg-neutral-900"
      : "bg-linear-to-br from-[#c0012c] to-[#8a0009]";

  return (
    <article className={`${base} ${tone}`}>
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="text-base font-bold tracking-wide">{brand}</span>
          <span className="text-base font-semibold tracking-[0.12em]">
            {formatMasked(last4)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white ring-1 ring-white/25">
              {badge}
            </span>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label="Supprimer la carte"
              className="flex size-7 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <TrashIcon className="size-4" />
            </button>
          )}
        </div>
      </header>

      <footer className="flex items-end justify-between text-[13px] font-medium">
        <span className="text-white/85">{holder}</span>
        <span className="text-white/85">{expiry}</span>
      </footer>
    </article>
  );
};

export const VisaBrand = () => <>VISA</>;

export const MastercardBrand = () => (
  <span className="flex items-center gap-[-4px]">
    <span
      aria-hidden
      className="size-5 rounded-full"
      style={{ backgroundColor: "#eb5c1f" }}
    />
    <span
      aria-hidden
      className="-ml-2 size-5 rounded-full"
      style={{ backgroundColor: "#f7b024", mixBlendMode: "multiply" }}
    />
  </span>
);
