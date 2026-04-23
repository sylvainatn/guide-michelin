import Link from "next/link";
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

export default function RewardsPage() {
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
        <h1 className="font-medium text-[13px] text-[#9ca3af]">Mes Récompenses</h1>
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
          <span className="text-[10px] font-semibold text-[#c0012c]">Programme fidélité</span>
        </div>
        <h2 className="font-serif font-bold text-[28px] leading-[34px] mt-2">
          Vos<br />Récompenses.
        </h2>
        <p className="text-[14px] text-[#6b7280] leading-relaxed mt-1">
          Réservez vos premières escapades<br />
          et débloquez des privilèges exclusifs.
        </p>
      </div>

      {/* Content */}
      <div className="px-6 flex flex-col gap-4 mt-8 pb-[100px]">
        {/* Status Card */}
        <div className="bg-[#fafafa] border border-[#ebebeb] p-5 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-[52px] h-[52px] bg-[#c0012c] rounded-full flex items-center justify-center">
              <span className="font-serif font-bold text-[22px] text-white">M</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold text-[16px]">Marie D.</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f5f5f5] rounded-xl text-[#9ca3af]">
                <LockIcon className="w-3 h-3" />
                <span className="text-[11px] font-semibold">Aucun statut · Débutez !</span>
              </div>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#ebebeb]" />

          <div className="flex flex-col gap-2.5">
            <p className="text-[12px] font-medium text-[#9ca3af] self-center">
              0 réservation effectuée
            </p>
            <div className="relative mt-2">
              <div className="h-2 bg-[#ebebeb] rounded-full w-full relative">
                <div className="absolute left-0 top-0 bottom-0 bg-[#c0012c] rounded-full w-0" />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 left-[20%] w-3 h-3 bg-[#ebebeb] rounded-full border-2 border-white shadow-sm" />
              <div className="absolute top-1/2 -translate-y-1/2 left-[50%] w-3 h-3 bg-[#ebebeb] rounded-full border-2 border-white shadow-sm" />
              <div className="absolute top-1/2 -translate-y-1/2 left-[80%] w-3 h-3 bg-[#ebebeb] rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#bbb] mt-1">
              <span className="font-medium text-[#9ca3af]">Explorateur · 3</span>
              <span>Initié · 6</span>
              <span>Ambassadeur · 8</span>
            </div>
          </div>

          <div className="bg-[#fdf0f2] border border-[#f0c0c8] p-3.5 rounded-xl flex items-center justify-between mt-2">
            <div className="flex flex-col gap-0.5">
              <p className="text-[13px] font-semibold text-[#c0012c] leading-tight">
                Votre première escapade<br />vous attend
              </p>
              <p className="text-[11px] text-[#c0012c]/50">
                Réservez et commencez à débloquer
              </p>
            </div>
            <div className="w-9 h-9 bg-[#c0012c] rounded-full flex items-center justify-center text-white shrink-0">
              <ArrowRightIcon className="w-[18px] h-[18px]" />
            </div>
          </div>
        </div>

        {/* Tier 1 Section */}
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-2xl h-[70px] px-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-[#f0f0f0] rounded-xl flex items-center justify-center shrink-0">
              <AwardRibbonIcon className="w-[22px] h-[22px] text-[#6b7280]" />
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-[15px] font-bold">Explorateur</p>
              <p className="text-[12px] text-[#9ca3af] leading-tight mt-0.5">Dès 3 réservations<br />Premier palier</p>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#fdf0f2] rounded-full text-[#c0012c]">
              <LockIcon className="w-[11px] h-[11px]" />
              <span className="text-[11px] font-semibold">3 rés.</span>
            </div>
          </div>

          {/* Tier 1 Sub Items */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 pt-1 pb-0.5 px-1">
              <CutleryCrossedIcon className="w-3 h-3 text-[#6b7280]" />
              <span className="text-[12px] font-semibold text-[#6b7280]">Restaurants</span>
            </div>
            
            <TierItem text="Dessert offert" />
            <TierItem text="Amuse-bouche signature ou création du chef" />
            <TierItem text="Invitation à un événement culinaire local" />

            <div className="flex items-center gap-2 pt-2 pb-0.5 px-1">
              <BuildingIcon className="w-3 h-3 text-[#6b7280]" />
              <span className="text-[12px] font-semibold text-[#6b7280]">Hôtels</span>
            </div>
            
            <TierItem text="Accès spa 1 journée" />
            <TierItem text="Massage court ou soin découverte" />
            <TierItem text="Petit upgrade confort (chambre, boisson, produit local)" />
          </div>
        </div>

        {/* Tier 2 Section */}
        <div className="flex flex-col gap-1.5 mt-6 opacity-60">
          <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-2xl h-[70px] px-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-[#f0f0f0] rounded-xl flex items-center justify-center shrink-0">
              <StarFilledIcon className="w-[22px] h-[22px] text-[#9ca3af]" />
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-[15px] font-bold text-[#9ca3af]">Initié</p>
              <p className="text-[12px] text-[#bbb] leading-tight mt-0.5">Dès 6 réservations</p>
            </div>
            <div className="inline-flex items-center px-2.5 py-1 bg-[#f5f5f5] rounded-full text-[#bbb]">
              <span className="text-[11px] font-medium">6 rés.</span>
            </div>
          </div>

          {/* Tier 2 Sub Items */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 pt-1 pb-0.5 px-1">
              <CutleryCrossedIcon className="w-3 h-3 text-[#9ca3af]" />
              <span className="text-[12px] font-semibold text-[#9ca3af]">Restaurants</span>
            </div>
            
            <TierItem text="Cours de cuisine avec un chef" isLocked />
            <TierItem text="Visite cuisines + échange avec l'équipe" isLocked />
            <TierItem text="Réservation de table haut de gamme" isLocked />
            <TierItem text="Accès à une soirée gastronomique exclusive" isLocked />

            <div className="flex items-center gap-2 pt-2 pb-0.5 px-1">
              <BuildingIcon className="w-3 h-3 text-[#9ca3af]" />
              <span className="text-[12px] font-semibold text-[#9ca3af]">Hôtels</span>
            </div>
            
            <TierItem text="Accès spa complet ou salle de sport" isLocked />
            <TierItem text="Early check-in / Late check-out" isLocked />
            <TierItem text="Crédit hôtel (bar / restaurant)" isLocked />
          </div>
        </div>

        {/* Tier 3 Header */}
        <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-2xl h-[70px] px-4 flex items-center gap-3 mt-6 opacity-40">
          <div className="w-11 h-11 bg-[#f0f0f0] rounded-xl flex items-center justify-center shrink-0">
            <GemIcon className="w-[22px] h-[22px] text-[#bbb]" />
          </div>
          <div className="flex flex-col flex-1">
            <p className="text-[15px] font-bold text-[#bbb]">Ambassadeur</p>
            <p className="text-[12px] text-[#ccc] leading-tight mt-0.5">Dès 8 réservations · Expérience VIP</p>
          </div>
          <div className="inline-flex items-center px-2.5 py-1 bg-[#f5f5f5] rounded-full text-[#ccc]">
            <span className="text-[11px] font-medium">8 rés.</span>
          </div>
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

function TierItem({ text, isLocked = true }: { text: string; isLocked?: boolean }) {
  return (
    <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-xl h-[54px] px-4 flex items-center gap-3">
      <div className="w-2 h-2 bg-[#ddd] rounded-sm shrink-0" />
      <span className="flex-1 text-[13px] text-[#9ca3af] leading-tight">
        {text}
      </span>
      {isLocked && <LockIcon className="w-3.5 h-3.5 text-[#bbb]" />}
    </div>
  );
}
