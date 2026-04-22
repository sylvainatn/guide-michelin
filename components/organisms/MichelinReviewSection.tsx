import {
  FlameIcon,
  GemIcon,
  MusicNoteIcon,
  RefreshIcon,
  RosetteIcon,
  UserIcon,
} from "../atoms/icons";
import { CriteriaRow } from "../molecules/CriteriaRow";
import { InspectorCard } from "../molecules/InspectorCard";
import type { MichelinReviewDTO } from "../../lib/restaurants/client";

type Props = {
  review: MichelinReviewDTO;
};

export const MichelinReviewSection = ({ review }: Props) => (
  <section className="flex flex-col gap-5">
    <div className="flex flex-col gap-3">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#fbe4e9] px-3 py-1 text-[12px] font-semibold text-primary">
        <RosetteIcon className="size-3.5" />
        Le Verdict de l&apos;Expert
      </span>
      <h2 className="font-serif text-3xl font-bold leading-tight text-tertiary">
        Les 5 Critères
        <br />
        Mondiaux Michelin.
      </h2>
    </div>

    <div className="flex flex-col gap-4">
      <CriteriaRow
        icon={<GemIcon className="size-5" />}
        title="Qualité des produits"
        subtitle="Sélection rigoureuse et fraîcheur absolue"
        score={review.productsScore}
      />
      <CriteriaRow
        icon={<MusicNoteIcon className="size-5" />}
        title="Harmonie des saveurs"
        subtitle="Équilibre parfait des goûts"
        score={review.harmonyScore}
      />
      <CriteriaRow
        icon={<FlameIcon className="size-5" />}
        title="Maîtrise des cuissons"
        subtitle="Précision technique pour sublimer"
        score={review.masteryScore}
      />
      <CriteriaRow
        icon={<UserIcon className="size-5" />}
        title="Personnalité du chef"
        subtitle="Une signature unique et créative"
        score={review.personalityScore}
      />
      <CriteriaRow
        icon={<RefreshIcon className="size-5" />}
        title="Régularité"
        subtitle="Constance de la qualité sur la carte"
        score={review.regularityScore}
      />
    </div>

    {review.inspectorName && (
      <InspectorCard
        inspectorName={review.inspectorName}
        verdict={review.verdict}
      />
    )}
  </section>
);
