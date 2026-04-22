"use client";

import { useState, type SyntheticEvent } from "react";
import { isValidEmail } from "../../lib/auth/validators";
import { Button } from "../atoms/Button";
import { ErrorText } from "../atoms/ErrorText";
import { IconInput } from "../atoms/IconInput";
import { IconTile } from "../atoms/IconTile";
import { OrDivider } from "../atoms/OrDivider";
import {
  LockFilledIcon,
  MailIcon,
  PaperPlaneIcon,
} from "../atoms/icons";
import { Alert } from "../molecules/Alert";
import { FieldLabel } from "../molecules/FieldLabel";
import { SocialAuthRow } from "../molecules/SocialAuthRow";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailOk = isValidEmail(email);

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailOk) return;
    setError(null);
    setPending(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setSent(true);
    } catch {
      setError("Envoi impossible. Réessayez plus tard.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <IconTile size="lg">
        <LockFilledIcon className="size-6" />
      </IconTile>

      <header className="space-y-1.5">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900">
          Mot de passe
          <br />
          oublié ?
        </h1>
        <p className="text-sm text-neutral-500">
          Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
        </p>
      </header>

      <div className="space-y-2">
        <FieldLabel htmlFor="forgot-email">Adresse e-mail</FieldLabel>
        <IconInput
          id="forgot-email"
          type="email"
          autoComplete="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leadingIcon={<MailIcon className="size-5" />}
          valid={emailOk}
          required
        />
        <p className="text-xs text-neutral-400">
          Nous vous enverrons un lien valide 30 minutes.
        </p>
      </div>

      {error && <ErrorText>{error}</ErrorText>}

      <Button
        type="submit"
        disabled={!emailOk || pending}
        fullWidth
        className="h-12 rounded-xl text-sm"
        leadingIcon={<PaperPlaneIcon className="size-4" />}
      >
        {pending ? "Envoi…" : "Envoyer le lien"}
      </Button>

      <OrDivider />
      <SocialAuthRow />

      {sent && (
        <Alert title="E-mail envoyé !">
          Vérifiez votre boîte mail et cliquez sur le lien dans les 30 minutes.
        </Alert>
      )}
    </form>
  );
};
