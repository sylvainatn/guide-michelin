"use client";

import type { TravelEnvironment } from "../../../lib/auth/client";
import { Button } from "../../atoms/Button";
import {
  ArrowRightIcon,
  BuildingIcon,
  GrapeIcon,
  MountainIcon,
  PinIcon,
  WaveIcon,
} from "../../atoms/icons";
import { CategoryBadge } from "../../molecules/CategoryBadge";
import { SelectableCard } from "../../molecules/SelectableCard";
import { StepShell } from "../../molecules/StepShell";
import type { StepProps } from "./types";

type Item = {
  key: TravelEnvironment;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone: "blue" | "green" | "amber" | "neutral";
};

const ITEMS: Item[] = [
  {
    key: "SEA",
    icon: <WaveIcon className="size-6" />,
    title: "Bord de mer",
    subtitle: "Côtes & Plages",
    tone: "blue",
  },
  {
    key: "MOUNTAINS",
    icon: <MountainIcon className="size-6" />,
    title: "Sommets",
    subtitle: "Alpes & Pyrénées",
    tone: "green",
  },
  {
    key: "VINEYARDS",
    icon: <GrapeIcon className="size-6" />,
    title: "Vignes",
    subtitle: "Bordeaux, Bourgogne",
    tone: "amber",
  },
  {
    key: "CITY",
    icon: <BuildingIcon className="size-6" />,
    title: "Ville",
    subtitle: "Paris, Lyon, Nice",
    tone: "neutral",
  },
];

export const StepEnvironment = ({ state, setState, onNext }: StepProps) => {
  const toggle = (env: TravelEnvironment) => {
    const exists = state.environments.includes(env);
    setState({
      environments: exists
        ? state.environments.filter((e) => e !== env)
        : [...state.environments, env],
    });
  };

  const disabled = state.environments.length === 0;

  return (
    <StepShell
      badge={
        <CategoryBadge icon={<PinIcon className="size-3.5" />}>
          Environnement
        </CategoryBadge>
      }
      title={
        <>
          Quel cadre
          <br />
          vous fait rêver ?
        </>
      }
      subtitle="Choisissez un ou plusieurs environnements."
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
      <div className="grid grid-cols-2 gap-3">
        {ITEMS.map((it) => (
          <SelectableCard
            key={it.key}
            icon={it.icon}
            title={it.title}
            subtitle={it.subtitle}
            tone={it.tone}
            selected={state.environments.includes(it.key)}
            onClick={() => toggle(it.key)}
          />
        ))}
      </div>
    </StepShell>
  );
};
