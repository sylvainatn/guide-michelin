import { SlidersIcon } from "../atoms/icons";
import { CategoryBadge } from "./CategoryBadge";

export const PreferencesHero = () => (
  <div className="flex flex-col gap-3 pb-4">
    <CategoryBadge icon={<SlidersIcon className="h-3.5 w-3.5" />}>
      Modifiez vos goûts
    </CategoryBadge>
    <h2 className="font-serif text-3xl font-bold leading-[1.1] tracking-tight text-tertiary">
      Vos préférences
      <br />
      personnalisées.
    </h2>
  </div>
);
