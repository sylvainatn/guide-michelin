"use client";

import { Button } from "../../atoms/Button";
import { Chip } from "../../atoms/Chip";
import { ArrowRightIcon, UserIcon } from "../../atoms/icons";
import { NumberDisplay } from "../../atoms/NumberDisplay";
import { CategoryBadge } from "../../molecules/CategoryBadge";
import { RangeSlider } from "../../molecules/RangeSlider";
import { StepShell } from "../../molecules/StepShell";
import type { StepProps } from "./types";

const SLIDER_MAX = 60;

const TICKS = [
  { value: 18, label: "18" },
  { value: 25, label: "25" },
  { value: 35, label: "35" },
  { value: 45, label: "45" },
  { value: 60, label: "60+" },
];

const RANGES = [
  { label: "18–24", min: 18, max: 24 },
  { label: "25–30", min: 25, max: 30 },
  { label: "31–40", min: 31, max: 40 },
  { label: "41–54", min: 41, max: 54 },
  { label: "55+", min: 55, max: 120 },
];

const midOf = (r: (typeof RANGES)[number]) =>
  Math.min(SLIDER_MAX, Math.round((r.min + Math.min(r.max, SLIDER_MAX)) / 2));

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
      max={SLIDER_MAX}
      value={Math.min(state.age, SLIDER_MAX)}
      onChange={(age) => setState({ age })}
      ticks={TICKS}
    />
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {RANGES.map((r) => {
        const selected = state.age >= r.min && state.age <= r.max;
        return (
          <Chip
            key={r.label}
            selected={selected}
            onClick={() => setState({ age: midOf(r) })}
            className="w-full justify-center whitespace-nowrap"
          >
            {r.label} ans
          </Chip>
        );
      })}
    </div>
  </StepShell>
);
