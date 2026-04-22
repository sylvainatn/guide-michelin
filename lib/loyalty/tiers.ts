export type TierKey = "explorateur" | "initie" | "ambassadeur";

export type Tier = {
  key: TierKey;
  label: string;
  min: number;
};

export const TIERS: readonly Tier[] = [
  { key: "explorateur", label: "Explorateur", min: 0 },
  { key: "initie", label: "Initié", min: 3 },
  { key: "ambassadeur", label: "Ambassadeur", min: 8 },
] as const;

export type TierProgress = {
  current: Tier;
  next: Tier | null;
  remaining: number;
  ratioInTier: number;
};

export const computeTierProgress = (escapades: number): TierProgress => {
  let currentIdx = 0;
  for (let i = 0; i < TIERS.length; i++) {
    if (escapades >= TIERS[i]!.min) currentIdx = i;
  }
  const current = TIERS[currentIdx]!;
  const next = TIERS[currentIdx + 1] ?? null;
  const remaining = next ? Math.max(next.min - escapades, 0) : 0;
  const ratioInTier = next
    ? Math.min((escapades - current.min) / (next.min - current.min), 1)
    : 1;
  return { current, next, remaining, ratioInTier };
};
