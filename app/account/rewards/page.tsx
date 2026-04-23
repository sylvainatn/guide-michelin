"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftIcon,
  AwardRibbonIcon,
  XIcon,
  LockIcon,
  CutleryCrossedIcon,
  BuildingIcon,
  StarFilledIcon,
  GemIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "@/components/atoms/icons";
import { MutedText } from "@/components/atoms/MutedText";
import { useAuth } from "@/lib/auth/context";
import {
  reservationApi,
  type ReservationDTO,
} from "@/lib/reservation/client";
import { computeTierProgress, TIERS } from "@/lib/loyalty/tiers";

const buildDisplayName = (firstName: string, lastName: string) => {
  const lastInitial = lastName?.[0] ? `${lastName[0]}.` : "";
  return `${firstName} ${lastInitial}`.trim();
};

const countActiveReservations = (reservations: ReservationDTO[]) =>
  reservations.filter((r) => r.status !== "CANCELLED").length;

export default function RewardsPage() {
  const router = useRouter();
  const { user, status, getAccessToken } = useAuth();
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const token = getAccessToken();
    if (!token) return;

    let cancelled = false;
    reservationApi
      .list(token)
      .then((res) => {
        if (!cancelled) setReservations(res.reservations);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, getAccessToken]);

  const escapades = useMemo(
    () => countActiveReservations(reservations),
    [reservations],
  );
  const progress = useMemo(() => computeTierProgress(escapades), [escapades]);

  if (status !== "authenticated" || !user) {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </main>
    );
  }

  const displayName = buildDisplayName(user.firstName, user.lastName);
  const initial = (user.firstName?.[0] ?? user.pseudo[0] ?? "?").toUpperCase();

  const explorateur = TIERS.find((t) => t.key === "explorateur")!;
  const initie = TIERS.find((t) => t.key === "initie")!;
  const ambassadeur = TIERS.find((t) => t.key === "ambassadeur")!;

  const tierUnlocked = (key: "explorateur" | "initie" | "ambassadeur") => {
    const tierIdx = TIERS.findIndex((t) => t.key === key);
    const currentIdx = TIERS.findIndex((t) => t.key === progress.current.key);
    return currentIdx >= tierIdx;
  };

  const explorateurUnlocked = tierUnlocked("explorateur");
  const initieUnlocked = tierUnlocked("initie");
  const ambassadeurUnlocked = tierUnlocked("ambassadeur");

  // Progress bar relative to ambassadeur (final tier).
  const overallRatio = Math.min(escapades / ambassadeur.min, 1);

  const ctaLabel =
    progress.next === null
      ? "Votre statut maximal est atteint"
      : escapades === 0
        ? "Votre première escapade vous attend"
        : `Plus que ${progress.remaining} réservation${progress.remaining > 1 ? "s" : ""} pour ${progress.next.label}`;

  const ctaSublabel =
    progress.next === null
      ? "Profitez de vos privilèges Ambassadeur"
      : escapades === 0
        ? "Réservez et commencez à débloquer"
        : `Prochain palier · ${progress.next.label}`;

  const statusBadge =
    progress.current.key === "none" ? (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f5f5f5] rounded-xl text-[#9ca3af]">
        <LockIcon className="w-3 h-3" />
        <span className="text-[11px] font-semibold">
          Aucun statut · Débutez !
        </span>
      </div>
    ) : (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fdf0f2] rounded-xl text-[#c0012c]">
        <AwardRibbonIcon className="w-3 h-3" />
        <span className="text-[11px] font-semibold">
          {progress.current.label}
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-white flex flex-col relative font-sans text-[#1a1a1a] w-full max-w-[390px] mx-auto shadow-[0_0_40px_rgba(0,0,0,0.05)] border-x border-[#f0f0f0]">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <Link
          href="/account"
          className="w-9 h-9 bg-[#fdf0f2] rounded-xl flex items-center justify-center text-[#c0012c]"
        >
          <ArrowLeftIcon className="w-[18px] h-[18px]" />
        </Link>
        <h1 className="font-medium text-[13px] text-[#9ca3af]">
          Mes Récompenses
        </h1>
        <Link
          href="/account"
          className="w-9 h-9 bg-[#f5f5f5] rounded-xl flex items-center justify-center text-[#6b7280]"
        >
          <XIcon className="w-[18px] h-[18px]" />
        </Link>
      </div>

      {/* Header */}
      <div className="px-6 flex flex-col gap-2 mt-4">
        <div className="inline-flex w-fit items-center gap-1.5 px-3 py-1 bg-[#fdf0f2] border border-[#f0c0c8] rounded-full">
          <AwardRibbonIcon className="w-3 h-3 text-[#c0012c]" />
          <span className="text-[10px] font-semibold text-[#c0012c]">
            Programme fidélité
          </span>
        </div>
        <h2 className="font-serif font-bold text-[28px] leading-[34px] mt-2">
          Vos
          <br />
          Récompenses.
        </h2>
        <p className="text-[14px] text-[#6b7280] leading-relaxed mt-1">
          Réservez vos premières escapades
          <br />
          et débloquez des privilèges exclusifs.
        </p>
      </div>

      {/* Content */}
      <div className="px-6 flex flex-col gap-4 mt-8 pb-[100px]">
        {/* Status Card */}
        <div className="bg-[#fafafa] border border-[#ebebeb] p-5 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-[52px] h-[52px] bg-[#c0012c] rounded-full flex items-center justify-center">
              <span className="font-serif font-bold text-[22px] text-white">
                {initial}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold text-[16px]">{displayName}</p>
              {statusBadge}
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#ebebeb]" />

          <div className="flex flex-col gap-2.5">
            <p className="text-[12px] font-medium text-[#9ca3af] self-center">
              {loading
                ? "Chargement…"
                : `${escapades} réservation${escapades > 1 ? "s" : ""} effectuée${escapades > 1 ? "s" : ""}`}
            </p>
            <div className="relative mt-2">
              <div className="h-2 bg-[#ebebeb] rounded-full w-full relative">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-[#c0012c] rounded-full transition-[width] duration-500"
                  style={{ width: `${Math.round(overallRatio * 100)}%` }}
                />
              </div>
              <TierDot
                leftPercent={(explorateur.min / ambassadeur.min) * 100}
                unlocked={explorateurUnlocked}
              />
              <TierDot
                leftPercent={(initie.min / ambassadeur.min) * 100}
                unlocked={initieUnlocked}
              />
              <TierDot leftPercent={100} unlocked={ambassadeurUnlocked} />
            </div>
            <div className="flex justify-between items-center text-[11px] mt-1">
              <span
                className={`font-medium ${
                  explorateurUnlocked ? "text-[#c0012c]" : "text-[#9ca3af]"
                }`}
              >
                Explorateur · {explorateur.min}
              </span>
              <span
                className={
                  initieUnlocked ? "text-[#c0012c] font-medium" : "text-[#bbb]"
                }
              >
                Initié · {initie.min}
              </span>
              <span
                className={
                  ambassadeurUnlocked
                    ? "text-[#c0012c] font-medium"
                    : "text-[#bbb]"
                }
              >
                Ambassadeur · {ambassadeur.min}
              </span>
            </div>
          </div>

          <div className="bg-[#fdf0f2] border border-[#f0c0c8] p-3.5 rounded-xl flex items-center justify-between mt-2">
            <div className="flex flex-col gap-0.5">
              <p className="text-[13px] font-semibold text-[#c0012c] leading-tight">
                {ctaLabel}
              </p>
              <p className="text-[11px] text-[#c0012c]/50">{ctaSublabel}</p>
            </div>
            <Link
              href="/"
              aria-label="Découvrir les escapades"
              className="w-9 h-9 bg-[#c0012c] rounded-full flex items-center justify-center text-white shrink-0"
            >
              <ArrowRightIcon className="w-[18px] h-[18px]" />
            </Link>
          </div>
        </div>

        {/* Tier 1 Section */}
        <TierSection
          tone="active"
          title="Explorateur"
          subtitle={`Dès ${explorateur.min} réservations\nPremier palier`}
          threshold={explorateur.min}
          Icon={AwardRibbonIcon}
          unlocked={explorateurUnlocked}
          remainingToUnlock={Math.max(explorateur.min - escapades, 0)}
          restaurantRewards={[
            "Dessert offert",
            "Amuse-bouche signature ou création du chef",
            "Invitation à un événement culinaire local",
          ]}
          hotelRewards={[
            "Accès spa 1 journée",
            "Massage court ou soin découverte",
            "Petit upgrade confort (chambre, boisson, produit local)",
          ]}
        />

        {/* Tier 2 Section */}
        <TierSection
          tone={initieUnlocked ? "active" : "dim"}
          title="Initié"
          subtitle={`Dès ${initie.min} réservations`}
          threshold={initie.min}
          Icon={StarFilledIcon}
          unlocked={initieUnlocked}
          remainingToUnlock={Math.max(initie.min - escapades, 0)}
          restaurantRewards={[
            "Cours de cuisine avec un chef",
            "Visite cuisines + échange avec l'équipe",
            "Réservation de table haut de gamme",
            "Accès à une soirée gastronomique exclusive",
          ]}
          hotelRewards={[
            "Accès spa complet ou salle de sport",
            "Early check-in / Late check-out",
            "Crédit hôtel (bar / restaurant)",
          ]}
        />

        {/* Tier 3 Header */}
        <div
          className={`bg-[#fafafa] border border-[#e5e5e5] rounded-2xl h-[70px] px-4 flex items-center gap-3 mt-6 ${
            ambassadeurUnlocked ? "" : "opacity-40"
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              ambassadeurUnlocked ? "bg-[#fdf0f2]" : "bg-[#f0f0f0]"
            }`}
          >
            <GemIcon
              className={`w-[22px] h-[22px] ${
                ambassadeurUnlocked ? "text-[#c0012c]" : "text-[#bbb]"
              }`}
            />
          </div>
          <div className="flex flex-col flex-1">
            <p
              className={`text-[15px] font-bold ${
                ambassadeurUnlocked ? "text-[#1a1a1a]" : "text-[#bbb]"
              }`}
            >
              Ambassadeur
            </p>
            <p
              className={`text-[12px] leading-tight mt-0.5 ${
                ambassadeurUnlocked ? "text-[#6b7280]" : "text-[#ccc]"
              }`}
            >
              Dès {ambassadeur.min} réservations · Expérience VIP
            </p>
          </div>
          {ambassadeurUnlocked ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#fdf0f2] rounded-full text-[#c0012c]">
              <span className="text-[11px] font-semibold">Débloqué</span>
            </div>
          ) : (
            <div className="inline-flex items-center px-2.5 py-1 bg-[#f5f5f5] rounded-full text-[#ccc]">
              <span className="text-[11px] font-medium">
                {ambassadeur.min} rés.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Fixed CTA Bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] p-6 bg-gradient-to-t from-white via-white to-transparent pt-12 z-10 pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto w-full h-[52px] bg-[#c0012c] text-white font-bold text-[15px] rounded-xl shadow-[0px_4px_20px_0px_rgba(200,16,46,0.3)] flex items-center justify-center gap-2"
        >
          <span>Découvrir les escapades</span>
          <ChevronRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

type IconComponent = (props: { className?: string }) => React.ReactElement;

const TierDot = ({
  leftPercent,
  unlocked,
}: {
  leftPercent: number;
  unlocked: boolean;
}) => (
  <div
    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
      unlocked ? "bg-[#c0012c]" : "bg-[#ebebeb]"
    }`}
    style={{ left: `${leftPercent}%` }}
  />
);

const TierSection = ({
  tone,
  title,
  subtitle,
  threshold,
  Icon,
  unlocked,
  remainingToUnlock,
  restaurantRewards,
  hotelRewards,
}: {
  tone: "active" | "dim";
  title: string;
  subtitle: string;
  threshold: number;
  Icon: IconComponent;
  unlocked: boolean;
  remainingToUnlock: number;
  restaurantRewards: string[];
  hotelRewards: string[];
}) => {
  const dim = tone === "dim";
  return (
    <div
      className={`flex flex-col gap-1.5 mt-2 ${dim ? "opacity-60" : ""}`}
    >
      <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-2xl h-[70px] px-4 flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            unlocked ? "bg-[#fdf0f2]" : "bg-[#f0f0f0]"
          }`}
        >
          <Icon
            className={`w-[22px] h-[22px] ${
              unlocked ? "text-[#c0012c]" : "text-[#6b7280]"
            }`}
          />
        </div>
        <div className="flex flex-col flex-1">
          <p
            className={`text-[15px] font-bold ${
              dim ? "text-[#9ca3af]" : "text-[#1a1a1a]"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-[12px] leading-tight mt-0.5 whitespace-pre-line ${
              dim ? "text-[#bbb]" : "text-[#9ca3af]"
            }`}
          >
            {subtitle}
          </p>
        </div>
        {unlocked ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#fdf0f2] rounded-full text-[#c0012c]">
            <span className="text-[11px] font-semibold">Débloqué</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#fdf0f2] rounded-full text-[#c0012c]">
            <LockIcon className="w-[11px] h-[11px]" />
            <span className="text-[11px] font-semibold">
              {remainingToUnlock > 0
                ? `-${remainingToUnlock} rés.`
                : `${threshold} rés.`}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 pt-1 pb-0.5 px-1">
          <CutleryCrossedIcon
            className={`w-3 h-3 ${dim ? "text-[#9ca3af]" : "text-[#6b7280]"}`}
          />
          <span
            className={`text-[12px] font-semibold ${
              dim ? "text-[#9ca3af]" : "text-[#6b7280]"
            }`}
          >
            Restaurants
          </span>
        </div>

        {restaurantRewards.map((text) => (
          <TierItem key={text} text={text} isLocked={!unlocked} />
        ))}

        <div className="flex items-center gap-2 pt-2 pb-0.5 px-1">
          <BuildingIcon
            className={`w-3 h-3 ${dim ? "text-[#9ca3af]" : "text-[#6b7280]"}`}
          />
          <span
            className={`text-[12px] font-semibold ${
              dim ? "text-[#9ca3af]" : "text-[#6b7280]"
            }`}
          >
            Hôtels
          </span>
        </div>

        {hotelRewards.map((text) => (
          <TierItem key={text} text={text} isLocked={!unlocked} />
        ))}
      </div>
    </div>
  );
};

function TierItem({
  text,
  isLocked = true,
}: {
  text: string;
  isLocked?: boolean;
}) {
  return (
    <div
      className={`bg-[#fafafa] border rounded-xl h-[54px] px-4 flex items-center gap-3 ${
        isLocked ? "border-[#e5e5e5]" : "border-[#f0c0c8]"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-sm shrink-0 ${
          isLocked ? "bg-[#ddd]" : "bg-[#c0012c]"
        }`}
      />
      <span
        className={`flex-1 text-[13px] leading-tight ${
          isLocked ? "text-[#9ca3af]" : "text-[#1a1a1a]"
        }`}
      >
        {text}
      </span>
      {isLocked ? (
        <LockIcon className="w-3.5 h-3.5 text-[#bbb]" />
      ) : (
        <AwardRibbonIcon className="w-3.5 h-3.5 text-[#c0012c]" />
      )}
    </div>
  );
}
