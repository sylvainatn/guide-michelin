import type { ReactNode } from "react";
import { ArrowLeftIcon } from "../atoms/icons";

type Props = {
  title?: string;
  onBack: () => void;
  onSave?: () => void;
  saving?: boolean;
  rightAction?: ReactNode;
};

export const PreferencesTopBar = ({
  title = "Mes Préférences",
  onBack,
  onSave,
  saving = false,
  rightAction,
}: Props) => {
  const renderRight = () => {
    if (rightAction) return rightAction;
    if (onSave) {
      return (
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-primary px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-michelin-red-500 disabled:opacity-60"
        >
          {saving ? "…" : "Sauver"}
        </button>
      );
    }
    return <span className="w-9" aria-hidden />;
  };

  return (
    <div className="flex items-center justify-between pb-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Retour"
        className="flex size-9 items-center justify-center rounded-full bg-[#fbe4e9] text-primary"
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </button>
      <h1 className="text-[15px] font-semibold text-tertiary">{title}</h1>
      {renderRight()}
    </div>
  );
};
