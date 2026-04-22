"use client";

import type { BudgetTier } from "../../../lib/auth/client";
import { Button } from "../../atoms/Button";
import { ArrowRightIcon, WalletIcon } from "../../atoms/icons";
import { NumberDisplay } from "../../atoms/NumberDisplay";
import { CategoryBadge } from "../../molecules/CategoryBadge";
import { RangeSlider } from "../../molecules/RangeSlider";
import { SelectableRow } from "../../molecules/SelectableRow";
import { StepShell } from "../../molecules/StepShell";
import type { StepProps } from "./types";

type Tier = {
  key: BudgetTier;
  title: string;
  subtitle: string;
  min: number;
  max: number;
};

const TIERS: Tier[] = [
  { key: "DISCOVERY", title: "Découverte · 200–350 €", subtitle: "Bib Gourmand + hôtel charme", min: 200, max: 350 },
  { key: "EXCELLENCE", title: "Excellence · 350–700 €", subtitle: "1 Étoile + Tablet Hotels", min: 350, max: 700 },
  { key: "PRESTIGE", title: "Prestige · 700 €+", subtitle: "Multi-étoilé + suite de luxe", min: 700, max: 1000 },
];

const tierOf = (price: number): BudgetTier => {
  if (price < 350) return "DISCOVERY";
  if (price < 700) return "EXCELLENCE";
  return "PRESTIGE";
};

const TICKS = [
  { value: 200, label: "200 €" },
  { value: 500, label: "500 €" },
  { value: 1000, label: "1 000 €" },
];

const Bullet = ({ active }: { active: boolean }) => (
  <span
    className={`flex size-2.5 rounded-full ${
      active ? "bg-primary" : "bg-neutral-300"
    }`}
  />
);

export const StepBudget = ({ state, setState, onNext }: StepProps) => {
  const currentTier = state.budgetTier ?? tierOf(state.budgetPerNight);
  return (
    <StepShell
      badge={
        <CategoryBadge icon={<WalletIcon className="size-3.5" />}>
          Budget par escapade
        </CategoryBadge>
      }
      title={
        <>
          Quel budget
          <br />
          pour rêver ?
        </>
      }
      subtitle="Par personne · nuit + expérience gastronomique."
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
        <NumberDisplay value={state.budgetPerNight} unit="€" />
        <p className="text-xs text-neutral-400">
          / personne · nuit + menu dégustation
        </p>
      </div>
      <RangeSlider
        min={200}
        max={1000}
        step={5}
        value={state.budgetPerNight}
        onChange={(v) =>
          setState({ budgetPerNight: v, budgetTier: tierOf(v) })
        }
        ticks={TICKS}
      />
      <div className="space-y-3">
        {TIERS.map((t) => {
          const selected = currentTier === t.key;
          return (
            <SelectableRow
              key={t.key}
              icon={<Bullet active={selected} />}
              title={t.title}
              subtitle={t.subtitle}
              tone="neutral"
              selected={selected}
              variant="outline"
              onClick={() =>
                setState({
                  budgetTier: t.key,
                  budgetPerNight: Math.round((t.min + t.max) / 2),
                })
              }
            />
          );
        })}
      </div>
    </StepShell>
  );
};
