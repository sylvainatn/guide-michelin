export type TierKey = "none" | "explorateur" | "initie" | "ambassadeur";

export type Tier = {
  key: TierKey;
  label: string;
  min: number;
};

/**
 * Paliers du programme fidélité Michelin.
 * Les seuils correspondent au nombre de réservations non annulées de l'utilisateur.
 */
export const TIERS: readonly Tier[] = [
  { key: "none", label: "Aucun statut", min: 0 },
  { key: "explorateur", label: "Explorateur", min: 3 },
  { key: "initie", label: "Initié", min: 6 },
  { key: "ambassadeur", label: "Ambassadeur", min: 8 },
] as const;

export type TierProgress = {
  current: Tier;
  next: Tier | null;
  remaining: number;
  ratioInTier: number;
};

export const computeTierProgress = (escapades: number): TierProgress => {
  const safe = Math.max(0, Math.floor(escapades));
  let currentIdx = 0;
  for (let i = 0; i < TIERS.length; i++) {
    if (safe >= TIERS[i]!.min) currentIdx = i;
  }
  const current = TIERS[currentIdx]!;
  const next = TIERS[currentIdx + 1] ?? null;
  const remaining = next ? Math.max(next.min - safe, 0) : 0;
  const ratioInTier = next
    ? Math.min((safe - current.min) / (next.min - current.min), 1)
    : 1;
  return { current, next, remaining, ratioInTier };
};
