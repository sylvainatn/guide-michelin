"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftIcon,
  HeartFilledIcon,
  HeartIcon,
  LayoutGridIcon,
} from "@/components/atoms/icons";
import { MutedText } from "@/components/atoms/MutedText";
import { useAuth } from "@/lib/auth/context";

type Category = "restaurant" | "hotel" | "vigne";

type GalleryItem = {
  id: string;
  title: string;
  category: Category;
  imageUrl: string;
  tone: "warm" | "blue" | "green" | "rose" | "gold";
  liked: boolean;
};

const FILTERS: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "restaurant", label: "Restaurants" },
  { id: "hotel", label: "Hôtels" },
  { id: "vigne", label: "Vignes" },
];

const TONE_BG: Record<GalleryItem["tone"], string> = {
  warm: "bg-[#f5efe6]",
  blue: "bg-[#f0f6ff]",
  green: "bg-[#f0fbf3]",
  rose: "bg-[#fdf0f2]",
  gold: "bg-[#fdfaf0]",
};

// Mock data — to be replaced by a real /account/gallery API once wired.
const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "bordeaux-secret",
    title: "Bordeaux Secret",
    category: "restaurant",
    imageUrl:
      "https://images.pexels.com/photos/32769460/pexels-photo-32769460.jpeg?auto=compress&cs=tinysrgb&w=640",
    tone: "warm",
    liked: true,
  },
  {
    id: "cote-azur",
    title: "Côte d'Azur",
    category: "hotel",
    imageUrl:
      "https://images.pexels.com/photos/1233281/pexels-photo-1233281.jpeg?auto=compress&cs=tinysrgb&w=640",
    tone: "blue",
    liked: true,
  },
  {
    id: "alsace",
    title: "Alsace",
    category: "vigne",
    imageUrl:
      "https://images.pexels.com/photos/2901212/pexels-photo-2901212.jpeg?auto=compress&cs=tinysrgb&w=400",
    tone: "green",
    liked: true,
  },
  {
    id: "perigord",
    title: "Périgord",
    category: "restaurant",
    imageUrl:
      "https://images.pexels.com/photos/34625755/pexels-photo-34625755.jpeg?auto=compress&cs=tinysrgb&w=400",
    tone: "rose",
    liked: true,
  },
  {
    id: "bourgogne",
    title: "Bourgogne",
    category: "vigne",
    imageUrl:
      "https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=400",
    tone: "gold",
    liked: true,
  },
];

export default function GalleryPage() {
  const router = useRouter();
  const { status } = useAuth();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [items, setItems] = useState<GalleryItem[]>(GALLERY_ITEMS);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.category === filter);
  }, [items, filter]);

  const likedCount = useMemo(
    () => items.filter((i) => i.liked).length,
    [items],
  );

  const toggleLike = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, liked: !i.liked } : i)),
    );
  };

  // Mosaic split: first 2 in the large row, the rest in the small row.
  const featured = filteredItems.slice(0, 2);
  const rest = filteredItems.slice(2);

  if (status !== "authenticated") {
    return (
      <main className="flex flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-stretch justify-center bg-neutral-100 md:items-center md:px-4 md:py-6">
      <div className="relative flex w-full flex-col bg-white text-[#1a1a1a] md:h-[calc(100dvh-3rem)] md:max-h-225 md:w-[min(390px,100%)] md:overflow-hidden md:rounded-3xl md:shadow-2xl md:ring-1 md:ring-black/10">
        {/* Top */}
        <div className="sticky top-0 z-10 flex flex-col gap-4 bg-white/90 px-6 pt-12 pb-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <Link
              href="/account"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fdf0f2] text-[#c0012c]"
              aria-label="Retour au compte"
            >
              <ArrowLeftIcon className="h-[18px] w-[18px]" />
            </Link>
            <h1 className="text-[16px] font-bold text-[#1a1a1a]">
              Ma Galerie Pulse
            </h1>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#1a1a1a]"
              aria-label="Changer la disposition"
            >
              <LayoutGridIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#c8def5] bg-[#f0f6ff] px-3 py-1">
              <HeartFilledIcon className="h-[11px] w-[11px] text-[#3b82f6]" />
              <span className="text-[10px] font-semibold leading-3 text-[#3b82f6]">
                {likedCount} vidéos et photos aimées
              </span>
            </span>
            <h2 className="font-['Playfair_Display',serif] text-[26px] font-bold leading-[29px] text-[#1a1a1a]">
              Votre catalogue
              <br />
              d&apos;inspiration.
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 pb-[100px]">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const selected = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                    selected
                      ? "bg-[#c0012c] font-semibold text-white"
                      : "border border-[#e5e5e5] bg-[#fafafa] font-medium text-[#6b7280]"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e5e5e5] bg-[#fafafa] px-6 py-10 text-center">
              <p className="text-[13px] text-[#9ca3af]">
                Aucune photo ou vidéo dans cette catégorie pour l&apos;instant.
              </p>
            </div>
          ) : (
            <>
              {/* Featured row (large cards, 2 cols) */}
              {featured.length > 0 && (
                <div className="flex gap-2">
                  {featured.map((item) => (
                    <div
                      key={item.id}
                      className={`relative flex h-[200px] flex-1 overflow-hidden rounded-[14px] ${TONE_BG[item.tone]}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {/* Bottom gradient for legibility */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                      <p className="absolute bottom-2.5 left-2.5 font-['Playfair_Display',serif] text-[11px] font-bold text-white drop-shadow">
                        {item.title}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleLike(item.id)}
                        aria-label={
                          item.liked
                            ? `Retirer ${item.title} des favoris`
                            : `Ajouter ${item.title} aux favoris`
                        }
                        className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-[14px] ${
                          item.liked
                            ? "bg-[#c0012c] text-white"
                            : "bg-white/90 text-[#c0012c]"
                        }`}
                      >
                        {item.liked ? (
                          <HeartFilledIcon className="h-3.5 w-3.5" />
                        ) : (
                          <HeartIcon className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Rest row (small cards, 3 cols) */}
              {rest.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {rest.map((item) => (
                    <div
                      key={item.id}
                      className={`relative h-[130px] overflow-hidden rounded-[14px] ${TONE_BG[item.tone]}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                      <p className="absolute bottom-1.5 left-1.5 font-['Playfair_Display',serif] text-[9px] font-normal text-white drop-shadow">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
