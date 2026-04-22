"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type SyntheticEvent } from "react";
import { ApiError } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidPseudo,
} from "../../lib/auth/validators";
import { Button } from "../atoms/Button";
import { Checkbox } from "../atoms/Checkbox";
import { ErrorText } from "../atoms/ErrorText";
import { IconInput } from "../atoms/IconInput";
import { ArrowRightIcon, MailIcon, UserIcon } from "../atoms/icons";
import { FieldLabel } from "../molecules/FieldLabel";
import { PasswordField } from "../molecules/PasswordField";
import {
  PasswordStrengthMeter,
  scorePassword,
} from "../molecules/PasswordStrengthMeter";

export const SignUpForm = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const [pseudo, setPseudo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const strength = useMemo(() => scorePassword(password), [password]);

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await signup({ email, pseudo, password, firstName, lastName });
      router.push("/onboarding");
    } catch (err) {
      if (err instanceof ApiError && err.code === "email_taken") {
        setError("Cet email est déjà utilisé.");
      } else if (err instanceof ApiError && err.code === "pseudo_taken") {
        setError("Ce pseudo est déjà pris.");
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
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Créer un compte.
        </h1>
        <p className="text-sm text-neutral-500">
          Rejoignez l&apos;expérience Michelin Escapade.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="signup-firstname">Prénom</FieldLabel>
          <IconInput
            id="signup-firstname"
            type="text"
            autoComplete="given-name"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            leadingIcon={<UserIcon className="size-5" />}
            valid={isValidName(firstName)}
            required
          />
        </div>
        <div>
          <FieldLabel htmlFor="signup-lastname">Nom</FieldLabel>
          <IconInput
            id="signup-lastname"
            type="text"
            autoComplete="family-name"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            valid={isValidName(lastName)}
            required
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="signup-pseudo">Pseudo</FieldLabel>
        <IconInput
          id="signup-pseudo"
          type="text"
          autoComplete="username"
          placeholder="@"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          minLength={3}
          maxLength={32}
          valid={isValidPseudo(pseudo)}
          required
        />
      </div>

      <div>
        <FieldLabel htmlFor="signup-email">Adresse e-mail</FieldLabel>
        <IconInput
          id="signup-email"
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

      <div className="space-y-2">
        <FieldLabel htmlFor="signup-password">Mot de passe</FieldLabel>
        <PasswordField
          value={password}
          onChange={setPassword}
          placeholder="Minimum 8 caractères"
          autoComplete="new-password"
          minLength={8}
          valid={isValidPassword(password)}
          required
        />
        {password.length > 0 && <PasswordStrengthMeter score={strength} />}
      </div>

      <Checkbox
        checked={termsAccepted}
        onChange={(e) => setTermsAccepted(e.target.checked)}
        required
        label={
          <>
            J&apos;accepte les{" "}
            <Link href="/cgu" className="font-medium text-neutral-900 underline">
              CGU
            </Link>{" "}
            & la{" "}
            <Link
              href="/privacy"
              className="font-medium text-neutral-900 underline"
            >
              politique de confidentialité
            </Link>
          </>
        }
      />

      {error && <ErrorText>{error}</ErrorText>}

      <Button
        type="submit"
        disabled={pending || !termsAccepted}
        fullWidth
        className="h-12 rounded-xl text-sm"
        trailingIcon={<ArrowRightIcon className="size-4" />}
      >
        {pending ? "Création…" : "Créer mon compte"}
      </Button>

      <p className="text-center text-sm text-neutral-500">
        Déjà un compte ?{" "}
        <Link href="/signin" className="font-semibold text-primary">
          Se connecter
        </Link>
      </p>
    </form>
  );
};
