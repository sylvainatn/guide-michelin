"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckIcon } from "../atoms/icons";
import { PasswordChangeSection } from "../molecules/PasswordChangeSection";
import { PersonalInfoSection } from "../molecules/PersonalInfoSection";
import { PreferencesTopBar } from "../molecules/PreferencesTopBar";
import { ApiError } from "../../lib/auth/client";
import type {
  UpdateUserInput,
  UserProfile,
} from "../../lib/auth/client";
import { profileApi, userApi } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";

export const PersonalInfoForm = ({
  initialProfile,
}: {
  initialProfile: UserProfile | null;
}) => {
  const router = useRouter();
  const { user, getAccessToken, updateUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [pseudo, setPseudo] = useState(user?.pseudo ?? "");
  const [age, setAge] = useState<number | null>(initialProfile?.age ?? null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = async () => {
    const token = getAccessToken();
    if (!token || !user || saving) return;
    setSaving(true);
    setFeedback(null);

    const userPatch: UpdateUserInput = {};
    if (firstName.trim() && firstName.trim() !== user.firstName) {
      userPatch.firstName = firstName.trim();
    }
    if (lastName.trim() && lastName.trim() !== user.lastName) {
      userPatch.lastName = lastName.trim();
    }
    if (pseudo.trim() && pseudo.trim() !== user.pseudo) {
      userPatch.pseudo = pseudo.trim();
    }

    const ageChanged = age !== null && age !== initialProfile?.age;

    if (Object.keys(userPatch).length === 0 && !ageChanged) {
      setFeedback("Aucun changement à enregistrer.");
      setSaving(false);
      return;
    }

    try {
      const tasks: Promise<unknown>[] = [];
      if (Object.keys(userPatch).length > 0) {
        tasks.push(
          userApi.updateMe(userPatch, token).then(({ user: next }) => {
            updateUser(next);
          }),
        );
      }
      if (ageChanged) {
        tasks.push(profileApi.update({ age: age! }, token));
      }
      await Promise.all(tasks);
      setFeedback("Informations enregistrées.");
    } catch (err) {
      setFeedback(
        err instanceof ApiError
          ? err.code === "pseudo_taken"
            ? "Ce pseudo est déjà utilisé."
            : "Impossible d'enregistrer. Réessaie."
          : "Erreur réseau. Réessaie.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col">
      <PreferencesTopBar
        title="Informations personnelles"
        onBack={() => router.back()}
      />

      <div className="flex flex-col gap-5 pb-32 pt-2">
        <PersonalInfoSection
          firstName={firstName}
          lastName={lastName}
          pseudo={pseudo}
          email={user?.email ?? ""}
          age={age}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onPseudoChange={setPseudo}
          onAgeChange={setAge}
        />

        <PasswordChangeSection />
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center bg-linear-to-t from-white via-white/95 to-transparent px-4 pb-5 pt-10 md:px-6">
        <div className="pointer-events-auto w-full max-w-95 space-y-2">
          {feedback && (
            <p
              className={`rounded-md bg-white/95 px-3 py-1.5 text-center text-[12px] shadow ${
                feedback.includes("enregistrées") ? "text-[#2f8a5c]" : "text-primary"
              }`}
            >
              {feedback}
            </p>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-[14px] font-semibold text-white shadow-lg transition-colors hover:bg-michelin-red-500 disabled:opacity-60"
          >
            <CheckIcon className="h-4 w-4" />
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
};
