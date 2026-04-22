"use client";

import { useEffect } from "react";
import { XIcon } from "../atoms/icons";

type Tone = "danger" | "primary";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const TONES: Record<Tone, string> = {
  danger:
    "bg-primary text-white hover:bg-michelin-red-500 focus-visible:ring-primary/30",
  primary:
    "bg-tertiary text-white hover:bg-neutral-700 focus-visible:ring-tertiary/30",
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  tone = "danger",
  pending = false,
  onConfirm,
  onCancel,
}: Props) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, pending, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 py-6 sm:items-center"
      onClick={() => (pending ? null : onCancel())}
    >
      <div
        className="w-full max-w-95 rounded-3xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-3 flex items-start justify-between gap-3">
          <h2 className="text-[17px] font-semibold text-tertiary">{title}</h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            aria-label="Fermer"
            className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-60"
          >
            <XIcon className="size-4" />
          </button>
        </header>

        {description && (
          <p className="mb-5 text-sm leading-snug text-neutral-600">
            {description}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={`inline-flex h-11 flex-1 items-center justify-center rounded-xl px-4 text-[13px] font-semibold transition-colors disabled:opacity-60 ${TONES[tone]}`}
          >
            {pending ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
