import { PlusIcon } from "../atoms/icons";

type Props = {
  onClick?: () => void;
  label?: string;
};

export const AddPaymentMethodButton = ({
  onClick,
  label = "Ajouter un moyen de paiement",
}: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-4 text-sm font-medium text-neutral-700 transition-colors hover:border-primary hover:text-primary"
  >
    <span className="flex size-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
      <PlusIcon className="size-4" />
    </span>
    {label}
  </button>
);
