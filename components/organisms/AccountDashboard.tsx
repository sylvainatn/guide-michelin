import type { PublicUser } from "../../lib/auth/client";
import { computeTierProgress } from "../../lib/loyalty/tiers";
import {
  CalendarIcon,
  CreditCardIcon,
  ImageIcon,
  SlidersIcon,
  UserIcon,
  UsersGroupIcon,
} from "../atoms/icons";
import { AccountHeaderCard } from "../molecules/AccountHeaderCard";
import { AccountMenuItem } from "../molecules/AccountMenuItem";
import { AccountMenuList } from "../molecules/AccountMenuList";
import { LogoutRow } from "../molecules/LogoutRow";
import { RewardsCard } from "../molecules/RewardsCard";

type Props = {
  user: PublicUser;
  escapades: number;
  age?: number | null;
  city?: string | null;
  tribeCount?: number;
  onLogout: () => void;
};

const buildSubtitle = (age?: number | null, city?: string | null) => {
  const parts: string[] = [];
  if (typeof age === "number") parts.push(`${age} ans`);
  if (city) parts.push(city);
  return parts.join(" · ");
};

const buildDisplayName = (user: PublicUser) => {
  const lastInitial = user.lastName?.[0] ? `${user.lastName[0]}.` : "";
  return `${user.firstName} ${lastInitial}`.trim();
};

export const AccountDashboard = ({
  user,
  escapades,
  age,
  city,
  tribeCount,
  onLogout,
}: Props) => {
  const progress = computeTierProgress(escapades);
  const subtitle = buildSubtitle(age, city);

  return (
    <div className="flex flex-col gap-4">
      <AccountHeaderCard
        initial={user.firstName?.[0] ?? user.pseudo[0] ?? "?"}
        displayName={buildDisplayName(user)}
        subtitle={subtitle || user.pseudo}
        escapades={escapades}
        progress={progress}
      />

      <RewardsCard progress={progress} />

      <AccountMenuList>
        <AccountMenuItem
          href="/account/personal"
          icon={<UserIcon className="h-5 w-5" />}
          label="Informations personnelles"
        />
        <AccountMenuItem
          href="/account/preferences"
          icon={<SlidersIcon className="h-5 w-5" />}
          label="Mes Préférences"
        />
        <AccountMenuItem
          href="/account/history"
          icon={<CalendarIcon className="h-5 w-5" />}
          label="Historique & Réservations"
        />
        <AccountMenuItem
          href="/account/payments"
          icon={<CreditCardIcon className="h-5 w-5" />}
          label="Paiements & Sécurité"
        />
        <AccountMenuItem
          href="/account/gallery"
          tone="blue"
          icon={<ImageIcon className="h-5 w-5" />}
          label="Ma Galerie Pulse"
        />
        <AccountMenuItem
          href="/account/tribe"
          tone="green"
          icon={<UsersGroupIcon className="h-5 w-5" />}
          label="Mes Amis & Tribu"
          count={tribeCount}
        />
      </AccountMenuList>

      <LogoutRow onClick={onLogout} />
    </div>
  );
};
