"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SyntheticEvent } from "react";
import { ApiError } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import { isValidEmail, isValidPassword } from "../../lib/auth/validators";
import { Button } from "../atoms/Button";
import { Checkbox } from "../atoms/Checkbox";
import { ErrorText } from "../atoms/ErrorText";
import { IconInput } from "../atoms/IconInput";
import { OrDivider } from "../atoms/OrDivider";
import { ArrowRightIcon, MailIcon } from "../atoms/icons";
import { FieldLabel } from "../molecules/FieldLabel";
import { PasswordField } from "../molecules/PasswordField";
import { SocialAuthRow } from "../molecules/SocialAuthRow";

export const SignInForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const user = await login({ identifier: email, password });
      router.push(user.role === "ADMIN" ? "/dashboard" : "/account");
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
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Bon retour.
        </h1>
        <p className="text-sm text-neutral-500">
          Connectez-vous à votre compte.
        </p>
      </header>

      <div>
        <FieldLabel htmlFor="signin-email">Adresse e-mail</FieldLabel>
        <IconInput
          id="signin-email"
          type="email"
          autoComplete="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leadingIcon={<MailIcon className="size-5" />}
          valid={isValidEmail(email)}
          required
        />
      </div>

      <div>
        <FieldLabel htmlFor="signin-password">Mot de passe</FieldLabel>
        <PasswordField
          value={password}
          onChange={setPassword}
          valid={isValidPassword(password)}
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <Checkbox
          label="Se souvenir"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      {error && <ErrorText>{error}</ErrorText>}

      <Button
        type="submit"
        disabled={pending}
        fullWidth
        className="h-12 rounded-xl text-sm"
        trailingIcon={<ArrowRightIcon className="size-4" />}
      >
        {pending ? "Connexion…" : "Se connecter"}
      </Button>

      <OrDivider />
      <SocialAuthRow />

      <p className="text-center text-sm text-neutral-500">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="font-semibold text-primary">
          S&apos;inscrire
        </Link>
      </p>
    </form>
  );
};
