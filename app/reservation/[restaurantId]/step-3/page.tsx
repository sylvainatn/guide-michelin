"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReservationShell } from "@/components/molecules/reservation/ReservationShell";
import { StepBadge } from "@/components/molecules/reservation/StepBadge";
import { FriendInviteRow } from "@/components/molecules/reservation/FriendInviteRow";
import { PrimaryCTA } from "@/components/molecules/reservation/PrimaryCTA";
import {
  BookmarkIcon,
  MessageCircleIcon,
  SearchIcon,
  UsersIcon,
  WhatsAppIcon,
} from "@/components/atoms/icons";
import {
  buildDefaultReservation,
  reservationStorage,
} from "@/lib/reservation/storage";
import type { InvitedFriend } from "@/types/reservation";

const FRIENDS_SEED: InvitedFriend[] = [
  {
    id: "adrien",
    name: "Adrien M.",
    initial: "A",
    color: "#c0012c",
    status: "confirmed",
  },
  {
    id: "sophie",
    name: "Sophie L.",
    initial: "S",
    color: "#3b82f6",
    status: "pending",
  },
  {
    id: "lucas",
    name: "Lucas D.",
    initial: "L",
    color: "#22c55e",
    status: "pending",
  },
];

export default function ReservationStep3Page() {
  const router = useRouter();
  const params = useParams<{ restaurantId: string }>();
  const restaurantId = params?.restaurantId;

  const [query, setQuery] = useState("");
  const [friends, setFriends] = useState<InvitedFriend[]>(FRIENDS_SEED);

  useEffect(() => {
    if (!restaurantId) return;
    const stored = reservationStorage.read(restaurantId);
    if (stored?.social?.invitedFriends?.length) {
      const byId = new Map(
        stored.social.invitedFriends.map((f) => [f.id, f.status]),
      );
      setFriends((prev) =>
        prev.map((f) => ({ ...f, status: byId.get(f.id) ?? f.status })),
      );
    }
  }, [restaurantId]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((f) => f.name.toLowerCase().includes(term));
  }, [friends, query]);

  const confirmedCount = friends.filter((f) => f.status === "confirmed").length;
  const totalInvited = friends.filter((f) => f.status !== "pending").length + 1;
  const wishlistAvatars = [
    { id: "me", initial: "M", color: "#c0012c", active: true },
    ...friends.map((f) => ({
      id: f.id,
      initial: f.initial,
      color: f.status === "confirmed" ? f.color : "#ebebeb",
      active: f.status === "confirmed",
    })),
  ];

  if (!restaurantId) return null;

  const toggleFriend = (id: string) =>
    setFriends((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: f.status === "pending" ? "invited" : "pending",
            }
          : f,
      ),
    );

  const handleContinue = () => {
    const base =
      reservationStorage.read(restaurantId) ?? buildDefaultReservation(restaurantId);
    reservationStorage.write(restaurantId, {
      ...base,
      social: { invitedFriends: friends },
    });
    router.push(`/reservation/${restaurantId}/step-4`);
  };

  return (
    <ReservationShell
      current={3}
      onBack={() => router.back()}
      onClose={() => router.push("/")}
      header={
        <div className="flex flex-col gap-1.5">
          <StepBadge
            icon={<UsersIcon className="size-3" />}
            label="Partage & Collaboration"
          />
          <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold leading-[1.12] text-tertiary">
            Invitez vos
            <br />
            compagnons !
          </h1>
          <p className="text-[13px] leading-[1.5] text-neutral-500">
            Qui partage cette escapade avec vous ?
          </p>
        </div>
      }
      footer={<PrimaryCTA onClick={handleContinue}>Continuer</PrimaryCTA>}
    >
      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-2.5">
          <h2 className="text-sm font-bold text-tertiary">Rechercher un ami</h2>
          <label className="flex h-12 items-center gap-2.5 rounded-full border border-neutral-200 bg-neutral-50 px-3.5">
            <SearchIcon className="size-4 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nom ou @utilisateur…"
              className="flex-1 bg-transparent text-sm text-tertiary placeholder:text-neutral-400 focus:outline-none"
            />
          </label>

          <div className="flex flex-col gap-2">
            {filtered.map((friend) => (
              <FriendInviteRow
                key={friend.id}
                friend={friend}
                onToggle={() => toggleFriend(friend.id)}
              />
            ))}
            {filtered.length === 0 && (
              <p className="rounded-xl border border-dashed border-neutral-200 px-4 py-6 text-center text-xs text-neutral-400">
                Aucun ami ne correspond à votre recherche.
              </p>
            )}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-200" />
          <span className="text-xs text-neutral-400">ou partager via</span>
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#25d366] text-sm font-bold text-white"
          >
            <WhatsAppIcon className="size-5" />
            WhatsApp
          </button>
          <button
            type="button"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#007aff] text-sm font-bold text-white"
          >
            <MessageCircleIcon className="size-5" />
            iMessage
          </button>
        </div>

        <div className="flex flex-col gap-2.5 rounded-[14px] border border-neutral-200 bg-neutral-50 p-3.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-tertiary">
              <BookmarkIcon className="size-3.5 text-tertiary" />
              Wishlist Collaborative
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {confirmedCount + 1} / {totalInvited + friends.filter((f) => f.status === "pending").length} confirmés
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {wishlistAvatars.map((a) => (
                <span
                  key={a.id}
                  className={`flex size-8 items-center justify-center rounded-full text-[12px] font-bold ${
                    a.active ? "text-white" : "text-neutral-400"
                  }`}
                  style={{ backgroundColor: a.color }}
                >
                  {a.initial}
                </span>
              ))}
            </div>
            <p className="flex-1 text-[12px] text-neutral-500">
              {confirmedCount > 0
                ? `${friends.find((f) => f.status === "confirmed")?.name.split(" ")[0] ?? "Un ami"} a confirmé · En attente de ${friends.filter((f) => f.status !== "confirmed").length} amis`
                : "Aucune confirmation pour le moment"}
            </p>
          </div>
        </div>
      </div>
    </ReservationShell>
  );
}
