"use client";

import type { CuisineStyle } from "../../../lib/auth/client";
import { Button } from "../../atoms/Button";
import {
  ArrowRightIcon,
  CutleryCrossedIcon,
  LeafIcon,
  SparklesIcon,
} from "../../atoms/icons";
import { CategoryBadge } from "../../molecules/CategoryBadge";
import { SelectableRow } from "../../molecules/SelectableRow";
import { StepShell } from "../../molecules/StepShell";
import type { StepProps } from "./types";

type Item = {
  key: CuisineStyle;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone: "amber" | "pink" | "green";
};

const ITEMS: Item[] = [
  {
    key: "TRADITION",
    icon: <CutleryCrossedIcon className="size-6" />,
    title: "Tradition",
    subtitle: "Classique & maîtrise technique",
    tone: "amber",
  },
  {
    key: "CREATIVITY",
    icon: <SparklesIcon className="size-6" />,
    title: "Créativité",
    subtitle: "Avant-garde & innovation",
    tone: "pink",
  },
  {
    key: "ECO",
    icon: <LeafIcon className="size-6" />,
    title: "Éco-Responsable",
    subtitle: "★ Étoile Verte Michelin",
    tone: "green",
  },
];

export const StepCuisine = ({ state, setState, onNext }: StepProps) => {
  const toggle = (key: CuisineStyle) => {
    const exists = state.cuisines.includes(key);
    setState({
      cuisines: exists
        ? state.cuisines.filter((c) => c !== key)
        : [...state.cuisines, key],
    });
  };

  const disabled = state.cuisines.length === 0;

  return (
    <StepShell
      badge={
        <CategoryBadge icon={<CutleryCrossedIcon className="size-3.5" />}>
          Sensibilité culinaire
        </CategoryBadge>
      }
      title={
        <>
          Quelle cuisine
          <br />
          vous inspire ?
        </>
      }
      subtitle="Plusieurs choix possibles."
      footer={
        <Button
          fullWidth
          onClick={onNext}
          disabled={disabled}
          className="h-12 rounded-xl"
          trailingIcon={<ArrowRightIcon className="size-4" />}
        >
          Continuer
        </Button>
      }
    >
      <div className="space-y-3">
        {ITEMS.map((it) => (
          <SelectableRow
            key={it.key}
            icon={it.icon}
            title={it.title}
            subtitle={it.subtitle}
            tone={it.tone}
            selected={state.cuisines.includes(it.key)}
            variant="outline"
            onClick={() => toggle(it.key)}
          />
        ))}
      </div>
    </StepShell>
  );
};
