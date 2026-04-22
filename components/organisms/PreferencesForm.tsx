"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  BuildingIcon,
  CheckIcon,
  ClockIcon,
  ColumnIcon,
  CutleryCrossedIcon,
  GrapeIcon,
  HeartIcon,
  LeafIcon,
  MapFoldedIcon,
  MountainIcon,
  SparklesIcon,
  WalletIcon,
  WaveIcon,
  WineGlassIcon,
} from "../atoms/icons";
import { PreferenceChip } from "../atoms/PreferenceChip";
import { PreferenceSection } from "../molecules/PreferenceSection";
import { PreferencesHero } from "../molecules/PreferencesHero";
import { PreferencesTopBar } from "../molecules/PreferencesTopBar";
import { ApiError } from "../../lib/auth/client";
import type {
  BudgetTier,
  CuisineStyle,
  TravelEnvironment,
  TravelPace,
  TravelStyle,
  TripDuration,
  UserProfile,
} from "../../lib/auth/client";
import { profileApi } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";

type EnvOption = { key: TravelEnvironment; label: string; icon: ReactNode };
const ENV_OPTIONS: EnvOption[] = [
  { key: "SEA", label: "Bord de mer", icon: <WaveIcon className="h-4 w-4" /> },
  { key: "MOUNTAINS", label: "Sommets", icon: <MountainIcon className="h-4 w-4" /> },
  { key: "VINEYARDS", label: "Vignes", icon: <GrapeIcon className="h-4 w-4" /> },
  { key: "CITY", label: "Ville", icon: <BuildingIcon className="h-4 w-4" /> },
];

type CuisineOption = {
  key: CuisineStyle;
  label: string;
  icon?: ReactNode;
  tone?: "red" | "green";
};
const CUISINE_OPTIONS: CuisineOption[] = [
  { key: "TRADITION", label: "Tradition", icon: <CutleryCrossedIcon className="h-4 w-4" /> },
  { key: "CREATIVITY", label: "Créativité", icon: <SparklesIcon className="h-4 w-4" /> },
  { key: "ECO", label: "Éco-Responsable", tone: "green", icon: <LeafIcon className="h-4 w-4" /> },
];

type StyleOption = { key: TravelStyle; label: string; icon: ReactNode };
const STYLE_OPTIONS: StyleOption[] = [
  { key: "GASTRONOMIC", label: "Gastronomique", icon: <WineGlassIcon className="h-4 w-4" /> },
  { key: "ADVENTURE", label: "Aventure & Nature", icon: <MountainIcon className="h-4 w-4" /> },
  { key: "CULTURE", label: "Culture & Patrimoine", icon: <ColumnIcon className="h-4 w-4" /> },
  { key: "ROMANCE", label: "Romantique & Bien-être", icon: <HeartIcon className="h-4 w-4" /> },
];

type PaceOption = { key: TravelPace; label: string; icon: ReactNode };
const PACE_OPTIONS: PaceOption[] = [
  { key: "SLOW", label: "Slow Travel", icon: <ClockIcon className="h-4 w-4" /> },
  { key: "ROADTRIP", label: "Roadtrip", icon: <MapFoldedIcon className="h-4 w-4" /> },
];

type DurationOption = { key: TripDuration; label: string };
const DURATION_OPTIONS: DurationOption[] = [
  { key: "ONE_NIGHT", label: "1 nuit" },
  { key: "SHORT_BREAK", label: "2-3 nuits" },
  { key: "ONE_WEEK", label: "1 semaine" },
  { key: "EXTENDED", label: "+ 1 semaine" },
];

type BudgetOption = { key: BudgetTier; label: string };
const BUDGET_OPTIONS: BudgetOption[] = [
  { key: "DISCOVERY", label: "Découverte · 200–350 €" },
  { key: "EXCELLENCE", label: "Excellence · 350–700 €" },
  { key: "PRESTIGE", label: "Prestige · 700 €+" },
];

const BUDGET_MIDPOINT: Record<BudgetTier, number> = {
  DISCOVERY: 275,
  EXCELLENCE: 525,
  PRESTIGE: 850,
};

const toggle = <T,>(set: Set<T>, value: T): Set<T> => {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
};

export const PreferencesForm = ({
  initialProfile,
}: {
  initialProfile: UserProfile | null;
}) => {
  const router = useRouter();
  const { getAccessToken } = useAuth();

  const [env, setEnv] = useState<Set<TravelEnvironment>>(
    new Set(initialProfile?.environments ?? []),
  );
  const [cuisines, setCuisines] = useState<Set<CuisineStyle>>(
    new Set(initialProfile?.cuisines ?? []),
  );
  const [travelStyle, setTravelStyle] = useState<TravelStyle | null>(
    initialProfile?.travelStyle ?? null,
  );
  const [travelPace, setTravelPace] = useState<TravelPace | null>(
    initialProfile?.travelPace ?? null,
  );
  const [tripDuration, setTripDuration] = useState<TripDuration | null>(
    initialProfile?.tripDuration ?? null,
  );
  const [budgetTier, setBudgetTier] = useState<BudgetTier | null>(
    initialProfile?.budgetTier ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = async () => {
    const token = getAccessToken();
    if (!token || saving) return;
    setSaving(true);
    setFeedback(null);

    try {
      await profileApi.update(
        {
          environments: Array.from(env),
          cuisines: Array.from(cuisines),
          ...(travelStyle ? { travelStyle } : {}),
          ...(travelPace ? { travelPace } : {}),
          ...(tripDuration ? { tripDuration } : {}),
          ...(budgetTier
            ? {
                budgetTier,
                budgetPerNight: BUDGET_MIDPOINT[budgetTier],
              }
            : {}),
        },
        token,
      );
      setFeedback("Préférences enregistrées.");
    } catch (err) {
      setFeedback(
        err instanceof ApiError
          ? "Impossible d'enregistrer. Réessaie."
          : "Erreur réseau. Réessaie.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col">
      <PreferencesTopBar onBack={() => router.back()} />

      <PreferencesHero />

      <div className="flex flex-col gap-5 pb-32">
        <PreferenceSection title="Environnement">
          {ENV_OPTIONS.map((opt) => (
            <PreferenceChip
              key={opt.key}
              icon={opt.icon}
              selected={env.has(opt.key)}
              onClick={() => setEnv((prev) => toggle(prev, opt.key))}
            >
              {opt.label}
            </PreferenceChip>
          ))}
        </PreferenceSection>

        <PreferenceSection title="Sensibilité culinaire">
          {CUISINE_OPTIONS.map((opt) => (
            <PreferenceChip
              key={opt.key}
              icon={opt.icon}
              tone={opt.tone ?? "red"}
              selected={cuisines.has(opt.key)}
              onClick={() => setCuisines((prev) => toggle(prev, opt.key))}
            >
              {opt.label}
            </PreferenceChip>
          ))}
        </PreferenceSection>

        <PreferenceSection title="Style de voyage">
          {STYLE_OPTIONS.map((opt) => (
            <PreferenceChip
              key={opt.key}
              icon={opt.icon}
              selected={travelStyle === opt.key}
              onClick={() =>
                setTravelStyle((prev) => (prev === opt.key ? null : opt.key))
              }
            >
              {opt.label}
            </PreferenceChip>
          ))}
        </PreferenceSection>

        <PreferenceSection title="Rythme">
          {PACE_OPTIONS.map((opt) => (
            <PreferenceChip
              key={opt.key}
              icon={opt.icon}
              selected={travelPace === opt.key}
              onClick={() =>
                setTravelPace((prev) => (prev === opt.key ? null : opt.key))
              }
            >
              {opt.label}
            </PreferenceChip>
          ))}
        </PreferenceSection>

        <PreferenceSection title="Durée idéale">
          {DURATION_OPTIONS.map((opt) => (
            <PreferenceChip
              key={opt.key}
              selected={tripDuration === opt.key}
              onClick={() =>
                setTripDuration((prev) => (prev === opt.key ? null : opt.key))
              }
            >
              {opt.label}
            </PreferenceChip>
          ))}
        </PreferenceSection>

        <PreferenceSection title="Budget par escapade" withDivider={false}>
          {BUDGET_OPTIONS.map((opt) => (
            <PreferenceChip
              key={opt.key}
              icon={<WalletIcon className="h-4 w-4" />}
              selected={budgetTier === opt.key}
              onClick={() =>
                setBudgetTier((prev) => (prev === opt.key ? null : opt.key))
              }
            >
              {opt.label}
            </PreferenceChip>
          ))}
        </PreferenceSection>
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
            {saving ? "Enregistrement…" : "Enregistrer mes préférences"}
          </button>
        </div>
      </div>
    </div>
  );
};
