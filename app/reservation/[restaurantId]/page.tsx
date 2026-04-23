"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StepHeader } from "@/components/molecules/StepHeader";
import { MichelinStar } from "@/components/atoms/MichelinStar";
import { IconTile } from "@/components/atoms/IconTile";
import { BuildingIcon, ArrowRightIcon } from "@/components/atoms/icons";
import { MutedText } from "@/components/atoms/MutedText";
import { ErrorText } from "@/components/atoms/ErrorText";
import { DateSelector } from "@/components/molecules/reservation/DateSelector";
import { GuestCounter } from "@/components/molecules/reservation/GuestCounter";
import { RoomSelector } from "@/components/molecules/reservation/RoomSelector";
import { MichelinExtra } from "@/components/molecules/reservation/MichelinExtra";
import { useAuth } from "@/lib/auth/context";
import { restaurantApi, type RestaurantDetailDTO } from "@/lib/restaurants/client";
import { ApiError } from "@/lib/auth/client";
import type { ReservationStep1, ReservationDates, GuestConfig } from "@/types/reservation";
import { reservationStorage, buildDefaultReservation } from "@/lib/reservation/storage";

interface PageProps {
  params: Promise<{ restaurantId: string }>;
}

export default function ReservationPage({ params }: PageProps) {
  const router = useRouter();
  const { status, getAccessToken } = useAuth();
  const [restaurant, setRestaurant] = useState<RestaurantDetailDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  
  const defaultCheckIn = new Date();
  defaultCheckIn.setHours(0, 0, 0, 0);
  defaultCheckIn.setDate(defaultCheckIn.getDate() + 14);
  const defaultCheckOut = new Date(defaultCheckIn);
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 4);

  const [reservation, setReservation] = useState<Omit<ReservationStep1, 'restaurantName' | 'michelinStars'>>({
    restaurantId: "",
    dates: {
      checkIn: defaultCheckIn,
      checkOut: defaultCheckOut,
      nights: 4
    },
    guests: { adults: 4 },
    roomOptions: [
      {
        id: "suite-vignes",
        name: "Suite avec vue vignes",
        description: "Tablet Hotels · Prestige",
        category: "prestige",
        icon: "bed-double",
        selected: true
      },
      {
        id: "chambre-classique",
        name: "Chambre Classique", 
        description: "Tablet Hotels · Confort",
        category: "confort",
        icon: "bed-single",
        selected: false
      }
    ],
    michelinExtras: [
      {
        id: "menu-signature",
        name: "Inclus automatiquement",
        description: "Menu Signature en 5 temps",
        chef: restaurant?.chefName || "Chef",
        included: true
      }
    ]
  });

  // Load params first
  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setRestaurantId(resolvedParams.restaurantId);
      setReservation(prev => ({
        ...prev,
        restaurantId: resolvedParams.restaurantId
      }));
    })();
  }, [params]);

  // Load restaurant data
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
      return;
    }
    
    if (status !== "authenticated" || !restaurantId) return;
    
    const token = getAccessToken();
    if (!token) return;

    let cancelled = false;
    
    (async () => {
      try {
        setLoading(true);
        const { restaurant: r } = await restaurantApi.getById(token, restaurantId);
        if (!cancelled) {
          setRestaurant(r);
          setError(null);
          
          // Update chef name in extras
          setReservation(prev => ({
            ...prev,
            michelinExtras: prev.michelinExtras.map(extra => ({
              ...extra,
              chef: r.chefName || "Chef"
            }))
          }));
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("Restaurant introuvable.");
        } else {
          setError("Impossible de charger les informations du restaurant.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, restaurantId, getAccessToken, router]);

  const handleDateChange = (dates: ReservationDates | null) => {
    setReservation(prev => ({ ...prev, dates: dates ?? undefined }));
  };

  const handleGuestChange = (guests: GuestConfig) => {
    setReservation(prev => ({ ...prev, guests }));
  };

  const handleRoomSelect = (roomId: string) => {
    setReservation(prev => ({
      ...prev,
      roomOptions: prev.roomOptions.map(room => ({
        ...room,
        selected: room.id === roomId
      }))
    }));
  };

  const handleContinue = () => {
    if (!restaurantId) return;
    const previous = reservationStorage.read(restaurantId) ?? {};
    const hydrated = buildDefaultReservation(restaurantId, {
      ...previous,
      restaurantName: restaurant?.name ?? previous.restaurantName,
      chefName: restaurant?.chefName ?? previous.chefName,
      stars: restaurant?.stars ?? previous.stars ?? null,
      address: restaurant?.address ?? previous.address,
      dates: reservation.dates,
      guests: reservation.guests,
      roomOptions: reservation.roomOptions,
      michelinExtras: reservation.michelinExtras,
    });
    reservationStorage.write(restaurantId, hydrated);
    router.push(`/reservation/${restaurantId}/step-2`);
  };

  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (status !== "authenticated" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <MutedText>Chargement...</MutedText>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <ErrorText>{error}</ErrorText>
          <button
            onClick={handleBack}
            className="text-primary text-sm font-medium"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // No restaurant found
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <ErrorText>Restaurant introuvable</ErrorText>
          <button
            onClick={handleBack}
            className="text-primary text-sm font-medium"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden relative">
        {/* Header */}
        <div className="px-6 pt-13 pb-6 space-y-4">
          <StepHeader 
            current={1}
            total={5}
            onBack={handleBack}
          />

          {/* Restaurant Info */}
          <div className="flex items-center gap-2.5">
            <IconTile size="lg" className="bg-amber-50 text-amber-600">
              <BuildingIcon className="size-8" />
            </IconTile>
            
            <div className="flex-1 space-y-0.5">
              <h1 className="font-bold text-base text-tertiary">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-1.5">
                {restaurant.stars && <MichelinStar count={restaurant.stars} />}
                <div className="bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded-md">
                  <span className="text-xs font-medium text-neutral-500">
                    Tablet Hotels
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-200"></div>
          
          <div>
            <h2 className="font-bold text-2xl text-tertiary leading-tight">
              Configurez<br />
              votre pack.
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 space-y-4 pb-24">
          <DateSelector 
            onDateChange={handleDateChange}
            initialDates={reservation.dates}
          />
          
          <GuestCounter 
            onGuestChange={handleGuestChange}
            initialGuests={reservation.guests}
          />
          
          <RoomSelector 
            rooms={reservation.roomOptions}
            onRoomSelect={handleRoomSelect}
          />
          
          {reservation.michelinExtras.map((extra) => (
            <MichelinExtra key={extra.id} extra={extra} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <button
            onClick={handleContinue}
            disabled={!reservation.dates}
            className="w-full bg-primary text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reservation.dates ? "Continuer" : "Sélectionnez vos dates"}
            <ArrowRightIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}