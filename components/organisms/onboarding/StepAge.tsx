"use client";

import { Button } from "../../atoms/Button";
import { Chip } from "../../atoms/Chip";
import { ArrowRightIcon, UserIcon } from "../../atoms/icons";
import { NumberDisplay } from "../../atoms/NumberDisplay";
import { CategoryBadge } from "../../molecules/CategoryBadge";
import { RangeSlider } from "../../molecules/RangeSlider";
import { StepShell } from "../../molecules/StepShell";
import type { StepProps } from "./types";

const TICKS = [
  { value: 18, label: "18" },
  { value: 25, label: "25" },
  { value: 30, label: "30" },
  { value: 40, label: "40" },
  { value: 60, label: "60+" },
];

const RANGES = [
  { label: "18–24 ans", min: 18, max: 24 },
  { label: "25–30 ans", min: 25, max: 30 },
  { label: "31–40 ans", min: 31, max: 40 },
  { label: "41–55 ans", min: 41, max: 55 },
  { label: "55+ ans", min: 56, max: 120 },
];

const midOf = (r: (typeof RANGES)[number]) =>
  Math.min(60, Math.round((r.min + Math.min(r.max, 60)) / 2));

export const StepAge = ({ state, setState, onNext }: StepProps) => (
  <StepShell
    badge={
      <CategoryBadge icon={<UserIcon className="size-3.5" />}>
        Votre profil
      </CategoryBadge>
    }
    title={
      <>
        Quel est
        <br />
        votre âge ?
      </>
    }
    subtitle="Cela nous aide à personnaliser vos escapades idéales."
    footer={
      <Button
        fullWidth
        onClick={onNext}
        className="h-12 rounded-xl"
        trailingIcon={<ArrowRightIcon className="size-4" />}
      >
        Continuer
      </Button>
    }
  >
    <div className="space-y-1 text-center">
      <NumberDisplay value={state.age} unit="ans" />
      <p className="text-xs text-neutral-400">Cible recommandée : 25 – 35 ans</p>
    </div>
    <RangeSlider
      min={18}
      max={60}
      value={Math.min(state.age, 60)}
      onChange={(age) => setState({ age })}
      ticks={TICKS}
    />
    <div className="flex flex-wrap justify-center gap-2">
      {RANGES.map((r) => {
        const selected = state.age >= r.min && state.age <= r.max;
        return (
          <Chip
            key={r.label}
            selected={selected}
            onClick={() => setState({ age: midOf(r) })}
          >
            {r.label}
          </Chip>
        );
      })}
    </div>
  </StepShell>
);
