"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEventHandler } from "react";
import { ApiError } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import { Button } from "../atoms/Button";
import { ErrorText } from "../atoms/ErrorText";
import { FormField } from "../molecules/FormField";

export const SignInForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login({ email, password });
      router.push("/account");
    } catch (err) {
      setError(
        err instanceof ApiError && err.code === "invalid_credentials"
          ? "Email ou mot de passe incorrect."
          : "Connexion impossible. Réessaie.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        required
      />

      {error && <ErrorText>{error}</ErrorText>}

      <Button type="submit" disabled={pending} fullWidth>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
};
