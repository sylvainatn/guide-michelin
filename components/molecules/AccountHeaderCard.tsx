import Link from "next/link";
import { SettingsGearIcon } from "../atoms/icons";
import { TierBadge } from "../atoms/TierBadge";
import { UserInitialAvatar } from "../atoms/UserInitialAvatar";
import type { TierProgress } from "../../lib/loyalty/tiers";

export const AccountHeaderCard = ({
  initial,
  displayName,
  subtitle,
  escapades,
  progress,
  settingsHref = "/account/settings",
}: {
  initial: string;
  displayName: string;
  subtitle: string;
  escapades: number;
  progress: TierProgress;
  settingsHref?: string;
}) => (
  <div className="relative overflow-hidden rounded-3xl bg-primary px-5 pt-5 pb-6 text-white shadow-lg">
    <div className="flex items-center justify-between">
      <h1 className="text-base font-semibold">Mon Compte</h1>
      <Link
        href={settingsHref}
        aria-label="Réglages"
        className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
      >
        <SettingsGearIcon className="h-5 w-5" />
      </Link>
    </div>

    <div className="mt-5 flex items-center gap-4">
      <UserInitialAvatar initial={initial} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-xl font-semibold">{displayName}</p>
          <TierBadge label={progress.current.label} />
        </div>
        <p className="text-xs text-white/80">{subtitle}</p>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${Math.round(progress.ratioInTier * 100)}%` }}
          />
        </div>
        <p className="text-[11px] text-white/80">
          {escapades} escapade{escapades > 1 ? "s" : ""}
          {progress.next
            ? ` · ${progress.current.label} → ${progress.next.label} à ${progress.next.min}`
            : ` · ${progress.current.label} max`}
        </p>
      </div>
    </div>
  </div>
);
