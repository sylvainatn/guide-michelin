"use client";

import type { TravelStyle } from "../../../lib/auth/client";
import { Button } from "../../atoms/Button";
import {
  ArrowRightIcon,
  ColumnIcon,
  CompassIcon,
  HeartIcon,
  MountainIcon,
  WineGlassIcon,
} from "../../atoms/icons";
import { CategoryBadge } from "../../molecules/CategoryBadge";
import { SelectableRow } from "../../molecules/SelectableRow";
import { StepShell } from "../../molecules/StepShell";
import type { StepProps } from "./types";

type Item = {
  key: TravelStyle;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

const ITEMS: Item[] = [
  {
    key: "GASTRONOMIC",
    icon: <WineGlassIcon className="size-6" />,
    title: "Gastronomique",
    subtitle: "Expériences de table d'exception",
  },
  {
    key: "ADVENTURE",
    icon: <MountainIcon className="size-6" />,
    title: "Aventure & Nature",
    subtitle: "Grands espaces et sensations",
  },
  {
    key: "CULTURE",
    icon: <ColumnIcon className="size-6" />,
    title: "Culture & Patrimoine",
    subtitle: "Histoire, art et architecture",
  },
  {
    key: "ROMANCE",
    icon: <HeartIcon className="size-6" />,
    title: "Romantique & Bien-être",
    subtitle: "Spa, intimité et douceur",
  },
];

export const StepTravelStyle = ({ state, setState, onNext }: StepProps) => (
  <StepShell
    badge={
      <CategoryBadge icon={<CompassIcon className="size-3.5" />}>
        Style de voyage
      </CategoryBadge>
    }
    title={
      <>
        Comment voyagez-
        <br />
        vous ?
      </>
    }
    subtitle="Choisissez le style qui vous correspond le mieux."
    footer={
      <Button
        fullWidth
        onClick={onNext}
        disabled={!state.travelStyle}
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
          tone="neutral"
          selected={state.travelStyle === it.key}
          variant="filled"
          onClick={() => setState({ travelStyle: it.key })}
        />
      ))}
    </div>
  </StepShell>
);
