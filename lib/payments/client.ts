"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, request } from "../auth/client";
import { useAuth } from "../auth/context";

export type CardBrand = "VISA" | "MASTERCARD" | "CARD";

export type PaymentCardDTO = {
  id: string;
  brand: CardBrand;
  last4: string;
  holder: string;
  expMonth: number;
  expYear: number;
  createdAt: string;
};

export type CreatePaymentCardInput = {
  brand: CardBrand;
  last4: string;
  holder: string;
  expMonth: number;
  expYear: number;
};

export const paymentCardsApi = {
  list: (accessToken: string) =>
    request<{ cards: PaymentCardDTO[] }>("/me/payment-cards", {
      method: "GET",
      accessToken,
    }),

  create: (input: CreatePaymentCardInput, accessToken: string) =>
    request<{ card: PaymentCardDTO }>("/me/payment-cards", {
      method: "POST",
      body: JSON.stringify(input),
      accessToken,
    }),

  remove: (id: string, accessToken: string) =>
    request<void>(`/me/payment-cards/${id}`, {
      method: "DELETE",
      accessToken,
    }),
};

export const detectBrand = (digits: string): CardBrand => {
  const first = digits[0];
  if (first === "4") return "VISA";
  if (first === "5" || first === "2") return "MASTERCARD";
  return "CARD";
};

export const formatExpiry = (mm: number, yy: number) =>
  `${String(mm).padStart(2, "0")} / ${String(yy).padStart(2, "0")}`;

export const usePaymentCards = () => {
  const { getAccessToken, status } = useAuth();
  const [cards, setCards] = useState<PaymentCardDTO[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    const token = getAccessToken();
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const { cards: fetched } = await paymentCardsApi.list(token);
        if (!cancelled) setCards(fetched);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? "Impossible de charger les cartes."
            : "Erreur réseau.",
        );
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, getAccessToken]);

  const addCard = useCallback(
    async (input: CreatePaymentCardInput) => {
      const token = getAccessToken();
      if (!token) throw new Error("not_authenticated");
      const { card } = await paymentCardsApi.create(input, token);
      setCards((prev) => [...prev, card]);
      return card;
    },
    [getAccessToken],
  );

  const removeCard = useCallback(
    async (id: string) => {
      const token = getAccessToken();
      if (!token) throw new Error("not_authenticated");
      await paymentCardsApi.remove(id, token);
      setCards((prev) => prev.filter((c) => c.id !== id));
    },
    [getAccessToken],
  );

  return { cards, hydrated, error, addCard, removeCard };
};
