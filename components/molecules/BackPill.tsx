"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "../atoms/icons";
import { IconTile } from "../atoms/IconTile";

export const BackPill = ({
  label = "Retour",
  onClick,
}: {
  label?: string;
  onClick?: () => void;
}) => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={onClick ?? (() => router.back())}
      className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
    >
      <IconTile size="sm">
        <ArrowLeftIcon className="size-4" />
      </IconTile>
      {label}
    </button>
  );
};
