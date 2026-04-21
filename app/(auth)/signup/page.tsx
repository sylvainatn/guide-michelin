"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "../../../lib/auth/client";
import { useAuth } from "../../../lib/auth/context";

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
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
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Créer un compte</h1>
        <p className="text-sm text-neutral-500">
          Rejoins le Guide Michelin.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Prénom"
          autoComplete="given-name"
          value={firstName}
          onChange={setFirstName}
          required
        />
        <Field
          label="Nom"
          autoComplete="family-name"
          value={lastName}
          onChange={setLastName}
          required
        />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          required
        />
        <Field
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          minLength={8}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "Création…" : "Créer mon compte"}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        Déjà un compte ?{" "}
        <Link href="/signin" className="text-black underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

const Field = ({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium text-neutral-700">{label}</span>
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
    />
  </label>
);
