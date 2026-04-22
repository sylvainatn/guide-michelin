"use client";

import { useState } from "react";
import { ErrorText } from "../atoms/ErrorText";
import { LockIcon } from "../atoms/icons";
import { ApiError } from "../../lib/auth/client";
import { userApi } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import { isValidPassword } from "../../lib/auth/validators";
import { FieldLabel } from "./FieldLabel";
import { PasswordField } from "./PasswordField";

export const PasswordChangeSection = () => {
  const { getAccessToken } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sameAsCurrent =
    current.length > 0 && next.length > 0 && current === next;
  const confirmMismatch = confirm.length > 0 && next !== confirm;
  const canSubmit =
    current.length > 0 &&
    isValidPassword(next) &&
    next === confirm &&
    !sameAsCurrent &&
    !pending;

  const handleSubmit = async () => {
    const token = getAccessToken();
    if (!token || !canSubmit) return;
    setPending(true);
    setError(null);
    setSuccess(false);
    try {
      await userApi.changePassword(
        { currentPassword: current, newPassword: next },
        token,
      );
      setCurrent("");
      setNext("");
      setConfirm("");
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.code === "invalid_password"
            ? "Mot de passe actuel incorrect."
            : "Impossible de mettre à jour le mot de passe.",
        );
      } else {
        setError("Erreur réseau. Réessaie.");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="pb-5">
      <div className="mb-3 flex items-center gap-2">
        <LockIcon className="h-4 w-4 text-primary" />
        <h3 className="text-[15px] font-semibold text-tertiary">
          Mot de passe
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <FieldLabel htmlFor="pwd-current">Mot de passe actuel</FieldLabel>
          <PasswordField
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>

        <div>
          <FieldLabel htmlFor="pwd-new">Nouveau mot de passe</FieldLabel>
          <PasswordField
            value={next}
            onChange={setNext}
            autoComplete="new-password"
            placeholder="Au moins 8 caractères"
            minLength={8}
            valid={isValidPassword(next) && !sameAsCurrent}
          />
          {sameAsCurrent && (
            <ErrorText>Le nouveau mot de passe doit être différent.</ErrorText>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="pwd-confirm">Confirmer</FieldLabel>
          <PasswordField
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            placeholder="Ressaisir le nouveau mot de passe"
            valid={confirm.length > 0 && next === confirm}
          />
          {confirmMismatch && (
            <ErrorText>Les mots de passe ne correspondent pas.</ErrorText>
          )}
        </div>

        {error && <ErrorText>{error}</ErrorText>}
        {success && (
          <p className="text-[12px] font-medium text-[#2f8a5c]">
            Mot de passe mis à jour.
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-primary bg-white px-4 text-[13px] font-semibold text-primary transition-colors hover:bg-[#fbe4e9] disabled:opacity-50"
        >
          {pending ? "Mise à jour…" : "Modifier le mot de passe"}
        </button>
      </div>
    </section>
  );
};
