"use client";

import type {
  BudgetTier,
  TravelEnvironment,
  TravelPace,
  TravelStyle,
  TripDuration,
} from "../../../lib/auth/client";
import { Button } from "../../atoms/Button";
import {
  ArrowRightIcon,
  ClockIcon,
  LeafIcon,
  PencilIcon,
  SparklesIcon,
  StarSparkleIcon,
  UserIcon,
  WalletIcon,
} from "../../atoms/icons";
import { CategoryBadge } from "../../molecules/CategoryBadge";
import { StepShell } from "../../molecules/StepShell";
import type { OnboardingState } from "./types";

type Props = {
  firstName: string;
  lastName: string;
  state: OnboardingState;
  submitting?: boolean;
  onEdit: () => void;
  onSubmit: () => void;
};

const ENV_LABELS: Record<TravelEnvironment, string> = {
  SEA: "Bord de mer",
  MOUNTAINS: "Sommets",
  VINEYARDS: "Vignes & Campagne",
  CITY: "Ville",
};
const PACE_LABELS: Record<TravelPace, string> = {
  SLOW: "Slow",
  ROADTRIP: "Roadtrip",
};
const DURATION_LABELS: Record<TripDuration, string> = {
  ONE_NIGHT: "1 nuit",
  SHORT_BREAK: "2-3 nuits",
  ONE_WEEK: "1 semaine",
  EXTENDED: "+1 semaine",
};
const BUDGET_LABELS: Record<BudgetTier, string> = {
  DISCOVERY: "Découverte 200-350 €",
  EXCELLENCE: "Excellence 350-700 €",
  PRESTIGE: "Prestige 700 €+",
};

const persona = (style: TravelStyle | null, pace: TravelPace | null) => {
  const root =
    style === "GASTRONOMIC"
      ? "Épicurien"
      : style === "ADVENTURE"
      ? "Aventurier"
      : style === "CULTURE"
      ? "Culturel"
      : style === "ROMANCE"
      ? "Romantique"
      : "Explorateur";
  const suffix = pace === "SLOW" ? "Slow" : pace === "ROADTRIP" ? "Roadtrip" : "";
  return suffix ? `${root} ${suffix}` : root;
};

const InfoTag = ({
  icon,
  children,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  tone?: "pink" | "green" | "amber" | "sky" | "neutral";
}) => {
  const palettes = {
    pink: "bg-primary/10 text-primary",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    sky: "bg-sky-100 text-sky-700",
    neutral: "bg-neutral-100 text-neutral-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${palettes[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
};

export const StepSummary = ({
  firstName,
  lastName,
  state,
  submitting = false,
  onEdit,
  onSubmit,
}: Props) => {
  const name = `${firstName} ${lastName.slice(0, 1).toUpperCase()}.`;
  const initial = firstName.slice(0, 1).toUpperCase();
  const envLabel = state.environments.map((e) => ENV_LABELS[e]).join(" & ");

  return (
    <StepShell
      badge={
        <CategoryBadge icon={<StarSparkleIcon className="size-3.5" />}>
          Profil complété ✓
        </CategoryBadge>
      }
      title={<>Votre profil Escapade.</>}
      subtitle="Voici votre portrait d'Escapadeur configuré par l'algorithme Michelin."
      footer={
        <Button
          fullWidth
          onClick={onSubmit}
          disabled={submitting}
          className="h-12 rounded-xl"
        >
          {submitting ? "Enregistrement…" : "Lancer l'Exploration !"}
        </Button>
      }
    >
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
            {initial}
          </span>
          <div>
            <p className="text-base font-bold text-neutral-900">{name}</p>
            <CategoryBadge>{persona(state.travelStyle, state.travelPace)}</CategoryBadge>
          </div>
        </div>
        <div className="border-t border-neutral-100 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {envLabel && (
              <InfoTag icon={<LeafIcon className="size-3" />} tone="amber">
                {envLabel}
              </InfoTag>
            )}
            {state.cuisines.includes("ECO") && (
              <InfoTag icon={<LeafIcon className="size-3" />} tone="green">
                Éco-Responsable
              </InfoTag>
            )}
            {state.cuisines.includes("CREATIVITY") && (
              <InfoTag icon={<SparklesIcon className="size-3" />} tone="pink">
                Créativité
              </InfoTag>
            )}
            {state.cuisines.includes("TRADITION") && (
              <InfoTag tone="amber" icon={<SparklesIcon className="size-3" />}>
                Tradition
              </InfoTag>
            )}
            {state.travelPace && state.tripDuration && (
              <InfoTag tone="amber" icon={<ClockIcon className="size-3" />}>
                {PACE_LABELS[state.travelPace]} · {DURATION_LABELS[state.tripDuration]}
              </InfoTag>
            )}
            {state.budgetTier && (
              <InfoTag tone="pink" icon={<WalletIcon className="size-3" />}>
                {BUDGET_LABELS[state.budgetTier]}
              </InfoTag>
            )}
            <InfoTag tone="sky" icon={<UserIcon className="size-3" />}>
              {state.age} ans
            </InfoTag>
          </div>
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl bg-primary p-4 text-left text-white"
          onClick={onSubmit}
        >
          <div>
            <p className="text-xs text-white/80">Escapades correspondantes</p>
            <p className="text-lg font-bold">24 expériences</p>
          </div>
          <ArrowRightIcon className="size-5" />
        </button>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="mx-auto flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        <PencilIcon className="size-4" />
        Modifier mes préférences
      </button>
    </StepShell>
  );
};
