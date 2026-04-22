import Link from "next/link";
import { ArrowRightIcon, AwardRibbonIcon } from "../atoms/icons";
import { CircleIconBubble } from "../atoms/CircleIconBubble";
import type { TierProgress } from "../../lib/loyalty/tiers";
import { TierStepper } from "./TierStepper";

export const RewardsCard = ({
  progress,
  ctaHref = "/account/rewards",
  seeAllHref = "/account/rewards",
}: {
  progress: TierProgress;
  ctaHref?: string;
  seeAllHref?: string;
}) => (
  <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <CircleIconBubble
        tone="red"
        icon={<AwardRibbonIcon className="h-5 w-5" />}
      />
      <div className="flex-1">
        <p className="text-sm font-semibold text-tertiary">Mes Récompenses</p>
        <p className="text-[12px] text-neutral-500">
          Programme fidélité Michelin
        </p>
      </div>
      <Link
        href={seeAllHref}
        className="rounded-full bg-[#fbe4e9] px-3 py-1 text-[11px] font-semibold text-primary"
      >
        Voir tout
      </Link>
    </div>

    <div className="mt-4">
      <TierStepper currentKey={progress.current.key} />
    </div>

    {progress.next && (
      <Link
        href={ctaHref}
        className="mt-4 flex items-center gap-3 rounded-2xl bg-[#fbe4e9]/60 px-3 py-2.5 transition-colors hover:bg-[#fbe4e9]"
      >
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-tertiary">
            Plus que {progress.remaining} escapade
            {progress.remaining > 1 ? "s" : ""}
          </p>
          <p className="text-[11px] text-neutral-500">
            pour devenir {progress.next.label}
          </p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-white">
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      </Link>
    )}
  </div>
);
