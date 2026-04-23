"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import { InstagramStoryTemplate } from "../molecules/InstagramStoryTemplate";
import {
  ArrowLeftIcon,
  SlidersIcon,
  PinIcon,
  EyeIcon,
  UsersIcon,
  CameraIcon,
} from "../atoms/icons";
import { MutedText } from "../atoms/MutedText";
import { reservationApi, type ReservationDTO } from "@/lib/reservation/client";
import { useAuth } from "@/lib/auth/context";

type Tab = "UPCOMING" | "PAST";

const MONTHS_SHORT = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

export const HistoryDashboard = () => {
  const router = useRouter();
  const { getAccessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("UPCOMING");
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingStoryFor, setGeneratingStoryFor] = useState<ReservationDTO | null>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    reservationApi
      .list(token)
      .then((res) => {
        setReservations(res.reservations);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [getAccessToken]);

  const now = new Date();
  
  const filteredReservations = reservations.filter((r) => {
    const checkIn = new Date(r.checkIn);
    if (activeTab === "UPCOMING") {
      return checkIn >= now || r.status === "PENDING";
    }
    return checkIn < now && r.status !== "CANCELLED";
  });

  const formatDateRange = (checkInStr: string, checkOutStr: string) => {
    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);
    
    const startDay = checkIn.getDate();
    const endDay = checkOut.getDate();
    const month = MONTHS_SHORT[checkIn.getMonth()];
    const year = checkIn.getFullYear();
    
    return `${startDay}–${endDay} ${month} ${year}`;
  };

  const handleGenerateStory = async (res: ReservationDTO) => {
    setGeneratingStoryFor(res);
    // Wait for state to update and DOM to render
    setTimeout(async () => {
      if (!storyRef.current) return;
      try {
        const canvas = await html2canvas(storyRef.current, {
          useCORS: true,
          scale: 1, // The template is already 1080x1920
          backgroundColor: "#000",
        });

        canvas.toBlob(async (blob) => {
          if (!blob) return;

          const file = new File([blob], "story.jpeg", { type: "image/jpeg" });

          if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({ files: [file] })
          ) {
            await navigator.share({
              files: [file],
              title: "Mon escapade Michelin",
            });
          } else {
            // Fallback: download the image
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "michelin-story.jpeg";
            a.click();
            URL.revokeObjectURL(url);

            // Open Instagram camera if possible (mostly works on mobile native apps)
            window.location.href = "instagram://camera";
          }
          setGeneratingStoryFor(null);
        }, "image/jpeg", 0.9);
      } catch (err) {
        console.error("Error generating story:", err);
        setGeneratingStoryFor(null);
      }
    }, 100);
  };


  return (
    <div className="flex h-full flex-col bg-white rounded-[20px] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-[16px] px-[24px] pt-[52px]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/account")}
            className="flex size-9 items-center justify-center rounded-[10px] bg-[#fdf0f2] transition-colors"
          >
            <ArrowLeftIcon className="size-[18px] text-[#1a1a1a]" />
          </button>
          <h1 className="font-['Noto_Sans',sans-serif] text-[16px] font-bold text-[#1a1a1a]">
            Mes Escapades
          </h1>
          <button className="flex size-9 items-center justify-center rounded-[10px] bg-[#f5f5f5] transition-colors">
            <SlidersIcon className="size-[16px] text-[#1a1a1a]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex w-full items-center mt-4">
          <button
            onClick={() => setActiveTab("UPCOMING")}
            className={`flex-1 h-11 flex items-center justify-center rounded-t-xl text-sm font-bold transition-colors ${
              activeTab === "UPCOMING"
                ? "bg-primary text-white"
                : "bg-neutral-100 text-neutral-400 hover:text-tertiary font-medium"
            }`}
          >
            À venir
          </button>
          <button
            onClick={() => setActiveTab("PAST")}
            className={`flex-1 h-11 flex items-center justify-center rounded-t-xl text-sm font-bold transition-colors ${
              activeTab === "PAST"
                ? "bg-primary text-white"
                : "bg-neutral-100 text-neutral-400 hover:text-tertiary font-medium"
            }`}
          >
            Passées
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-[24px] pb-[100px] pt-[16px]">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <MutedText>Chargement de vos escapades…</MutedText>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-center">
            <MutedText>
              Aucune escapade {activeTab === "UPCOMING" ? "à venir" : "passée"}.
            </MutedText>
          </div>
        ) : (
          <div className="flex flex-col gap-[14px]">
            {filteredReservations.map((res) => {
              const isPast = new Date(res.checkIn) < now;
              const guestsCount = res.adults + (res.children || 0);

              return (
                <div
                  key={res.id}
                  className="flex flex-col overflow-hidden rounded-[16px] border border-[#ebebeb] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.03)]"
                >
                  {/* Card Image */}
                  <div className="relative h-[160px] w-full bg-neutral-200">
                    <img
                      src={
                        res.restaurant?.mainImageUrl ||
                        "/images/default-restaurant.png"
                      }
                      alt={res.restaurant?.name ?? "Restaurant"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/default-restaurant.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-[10%] left-[6.4%] font-['Inter',sans-serif] text-[11px] font-bold text-white">
                      {isPast ? "Terminé" : "★ Confirmé"}
                    </span>
                  </div>

                  {/* Card Info */}
                  <div className="flex flex-col gap-[10px] p-[14px]">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-[2px]">
                        <h2 className="font-['Playfair_Display',serif] text-[18px] font-bold leading-[21.6px] text-[#1a1a1a]">
                          {res.restaurant?.name ?? "Restaurant Inconnu"}
                        </h2>
                        <div className="flex items-center gap-[5px]">
                          <PinIcon className="size-[12px] shrink-0 text-[#6b7280]" />
                          <span className="font-['Noto_Sans',sans-serif] text-[12px] leading-[14.4px] text-[#6b7280]">
                            {res.restaurant?.address?.split(",")[0] ?? "Adresse"} ·{" "}
                            {formatDateRange(res.checkIn, res.checkOut)}
                          </span>
                        </div>
                      </div>
                      <div className="flex h-fit shrink-0 items-center rounded-[10px] border border-[#e5e5e5] bg-[#fafafa] px-[12px] py-[6px]">
                        <span className="font-['Noto_Sans',sans-serif] text-[14px] font-bold leading-[16.8px] text-[#1a1a1a]">
                          {res.totalAmount.toLocaleString("fr-FR")} €
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-[10px]">
                      <button
                        className={`flex h-[40px] flex-1 items-center justify-center gap-[6px] rounded-[10px] ${
                          isPast
                            ? "border border-[#e5e5e5] bg-[#fafafa]"
                            : "bg-[#fdf0f2]"
                        }`}
                      >
                        <EyeIcon
                          className={`size-[14px] ${
                            isPast ? "text-[#9ca3af]" : "text-primary"
                          }`}
                        />
                        <span
                          className={`font-['Noto_Sans',sans-serif] text-[12px] leading-[14.4px] ${
                            isPast
                              ? "font-medium text-[#9ca3af]"
                              : "font-semibold text-primary"
                          }`}
                        >
                          Voir les détails
                        </span>
                      </button>

                      {isPast ? (
                        <button
                          onClick={() => handleGenerateStory(res)}
                          disabled={generatingStoryFor?.id === res.id}
                          className="flex h-[40px] flex-1 items-center justify-center gap-[6px] rounded-[10px] bg-[#fdf0f2] disabled:opacity-50"
                        >
                          <CameraIcon className="size-[14px] text-primary" />
                          <span className="font-['Noto_Sans',sans-serif] text-[12px] font-semibold leading-[14.4px] text-primary">
                            {generatingStoryFor?.id === res.id ? "Génération..." : "Générer ma Story"}
                          </span>
                        </button>
                      ) : (
                        <div className="flex h-[40px] flex-1 items-center justify-center gap-[6px] rounded-[10px] border border-[#e5e5e5] bg-[#fafafa]">
                          <UsersIcon className="size-[14px] text-[#6b7280]" />
                          <span className="font-['Noto_Sans',sans-serif] text-[12px] font-medium leading-[14.4px] text-[#6b7280]">
                            {guestsCount} invité{guestsCount > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hidden Story Template for html2canvas */}
      {generatingStoryFor && (
        <InstagramStoryTemplate
          ref={storyRef}
          reservation={generatingStoryFor}
        />
      )}
    </div>
  );
};
