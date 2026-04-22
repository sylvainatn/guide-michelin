"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, XIcon } from "../atoms/icons";
import { IconTile } from "../atoms/IconTile";
import { StepProgressBar } from "../atoms/StepProgressBar";

type StepHeaderProps = {
  current: number;
  total: number;
  onBack?: () => void;
  onClose?: () => void;
};

export const StepHeader = ({
  current,
  total,
  onBack,
  onClose,
}: StepHeaderProps) => {
  const router = useRouter();
  const handleClose = onClose ?? (() => router.push("/"));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack}
          aria-label="Étape précédente"
          className="inline-flex disabled:opacity-30"
        >
          <IconTile size="sm">
            <ArrowLeftIcon className="size-4" />
          </IconTile>
        </button>
        <span className="text-sm font-medium text-neutral-600">
          Étape {current} sur {total}
        </span>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fermer"
          className="inline-flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
        >
          <XIcon className="size-4" />
        </button>
      </div>
      <StepProgressBar current={current} total={total} />
    </div>
  );
};
