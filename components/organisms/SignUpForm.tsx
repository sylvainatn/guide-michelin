"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEventHandler } from "react";
import { ApiError } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import { Button } from "../atoms/Button";
import { ErrorText } from "../atoms/ErrorText";
import { FormField } from "../molecules/FormField";

export const SignUpForm = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await signup({ email, password, firstName, lastName });
      router.push("/account");
    } catch (err) {
      if (err instanceof ApiError && err.code === "email_taken") {
        setError("Cet email est déjà utilisé.");
      } else if (err instanceof ApiError && err.code === "validation_error") {
        setError("Les informations saisies sont invalides.");
      } else {
        setError("Inscription impossible. Réessaie.");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        label="Prénom"
        autoComplete="given-name"
        value={firstName}
        onChange={setFirstName}
        required
      />
      <FormField
        label="Nom"
        autoComplete="family-name"
        value={lastName}
        onChange={setLastName}
        required
      />
      <FormField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        required
      />
      <FormField
        label="Mot de passe"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
        minLength={8}
        required
      />

      {error && <ErrorText>{error}</ErrorText>}

      <Button type="submit" disabled={pending} fullWidth>
        {pending ? "Création…" : "Créer mon compte"}
      </Button>
    </form>
  );
};
