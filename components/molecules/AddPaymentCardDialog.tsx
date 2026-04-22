"use client";

import { useEffect, useState } from "react";
import { ErrorText } from "../atoms/ErrorText";
import { IconInput } from "../atoms/IconInput";
import { XIcon } from "../atoms/icons";
import {
  type CardBrand,
  detectBrand,
} from "../../lib/payments/client";
import { FieldLabel } from "./FieldLabel";

const onlyDigits = (v: string) => v.replace(/\D/g, "");
const formatNumber = (digits: string) =>
  digits
    .replace(/(.{4})/g, "$1 ")
    .trim()
    .slice(0, 19);

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (card: {
    brand: CardBrand;
    last4: string;
    holder: string;
    expMonth: number;
    expYear: number;
  }) => void | Promise<void>;
};

export const AddPaymentCardDialog = ({ open, onClose, onSubmit }: Props) => {
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [mm, setMm] = useState("");
  const [yy, setYy] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setNumber("");
      setHolder("");
      setMm("");
      setYy("");
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const digits = onlyDigits(number);
  const brand = detectBrand(digits);
  const numberValid = digits.length >= 13 && digits.length <= 19;
  const holderValid = holder.trim().length >= 2;
  const mmNum = Number(mm);
  const yyNum = Number(yy);
  const mmValid = mmNum >= 1 && mmNum <= 12;
  const yyValid = yy.length === 2 && yyNum >= 24;
  const canSubmit = numberValid && holderValid && mmValid && yyValid;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError("Vérifie les champs du formulaire.");
      return;
    }
    try {
      await onSubmit({
        brand,
        last4: digits.slice(-4),
        holder: holder.trim(),
        expMonth: mmNum,
        expYear: yyNum,
      });
      onClose();
    } catch {
      setError("Impossible d'ajouter la carte. Réessaie.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ajouter un moyen de paiement"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 py-6 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-95 rounded-3xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-tertiary">
            Nouveau moyen de paiement
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          >
            <XIcon className="size-4" />
          </button>
        </header>

        <div className="flex flex-col gap-3">
          <div>
            <FieldLabel htmlFor="card-number">Numéro de carte</FieldLabel>
            <IconInput
              id="card-number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={formatNumber(digits)}
              onChange={(e) => setNumber(e.target.value)}
              valid={numberValid}
            />
            {digits.length > 0 && (
              <p className="mt-1 text-[11px] text-neutral-400">
                Détecté : {brand === "CARD" ? "Carte" : brand}
              </p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="card-holder">Titulaire</FieldLabel>
            <IconInput
              id="card-holder"
              type="text"
              autoComplete="cc-name"
              placeholder="Prénom Nom"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              valid={holderValid}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="card-mm">Mois</FieldLabel>
              <IconInput
                id="card-mm"
                inputMode="numeric"
                placeholder="MM"
                value={mm}
                onChange={(e) => setMm(onlyDigits(e.target.value).slice(0, 2))}
                valid={mmValid}
              />
            </div>
            <div>
              <FieldLabel htmlFor="card-yy">Année</FieldLabel>
              <IconInput
                id="card-yy"
                inputMode="numeric"
                placeholder="YY"
                value={yy}
                onChange={(e) => setYy(onlyDigits(e.target.value).slice(0, 2))}
                valid={yyValid}
              />
            </div>
          </div>

          {error && <ErrorText>{error}</ErrorText>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-[13px] font-semibold text-white transition-colors hover:bg-michelin-red-500 disabled:opacity-50"
          >
            Ajouter la carte
          </button>
        </div>
      </div>
    </div>
  );
};
