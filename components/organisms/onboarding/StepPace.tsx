"use client";

import type { TripDuration } from "../../../lib/auth/client";
import { Button } from "../../atoms/Button";
import { Chip } from "../../atoms/Chip";
import {
  ArrowRightIcon,
  ClockIcon,
  MapFoldedIcon,
} from "../../atoms/icons";
import { CategoryBadge } from "../../molecules/CategoryBadge";
import { PaceCard } from "../../molecules/PaceCard";
import { StepShell } from "../../molecules/StepShell";
import type { StepProps } from "./types";

const DURATIONS: { key: TripDuration; label: string }[] = [
  { key: "ONE_NIGHT", label: "1 nuit" },
  { key: "SHORT_BREAK", label: "2-3 nuits" },
  { key: "ONE_WEEK", label: "1 semaine" },
  { key: "EXTENDED", label: "+ 1 semaine" },
];

export const StepPace = ({ state, setState, onNext }: StepProps) => {
  const disabled = !state.travelPace || !state.tripDuration;
  return (
    <StepShell
      badge={
        <CategoryBadge icon={<ClockIcon className="size-3.5" />}>
          Rythme de voyage
        </CategoryBadge>
      }
      title={
        <>
          Quel est votre
          <br />
          rythme idéal ?
        </>
      }
      subtitle="Profondeur d'une destination ou diversité de découvertes ?"
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
        <PaceCard
          icon={<ClockIcon className="size-7" />}
          title="Slow Travel"
          subtitle="1 destination, immersion totale"
          selected={state.travelPace === "SLOW"}
          onClick={() => setState({ travelPace: "SLOW" })}
        />
        <PaceCard
          icon={<MapFoldedIcon className="size-7" />}
          title="Roadtrip"
          subtitle="Multi-étapes, diversité régionale"
          selected={state.travelPace === "ROADTRIP"}
          onClick={() => setState({ travelPace: "ROADTRIP" })}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-900">
          Durée idéale de l&apos;escapade
        </p>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <Chip
              key={d.key}
              selected={state.tripDuration === d.key}
              onClick={() => setState({ tripDuration: d.key })}
            >
              {d.label}
            </Chip>
          ))}
        </div>
      </div>
    </StepShell>
  );
};
