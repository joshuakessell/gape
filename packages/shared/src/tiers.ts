/** A growth tier the hole passes through as its radius increases. */
export interface Tier {
  index: number;
  name: string;
  minRadius: number;
}

export const TIERS: readonly Tier[] = [
  { index: 0, name: 'pothole', minRadius: 0 },
  { index: 1, name: 'manhole', minRadius: 2 },
  { index: 2, name: 'sinkhole', minRadius: 5 },
  { index: 3, name: 'crater', minRadius: 10 },
  { index: 4, name: 'abyss', minRadius: 20 },
];

/** The highest tier whose minRadius the given radius has reached. */
export function tierAt(radius: number): Tier {
  let current = TIERS[0]!;
  for (const tier of TIERS) {
    if (radius >= tier.minRadius) current = tier;
  }
  return current;
}

export function isMaxTier(tier: Tier): boolean {
  return tier.index === TIERS[TIERS.length - 1]!.index;
}

/** The next tier up, or the same tier if already max. */
export function advanceTier(tier: Tier): Tier {
  return isMaxTier(tier) ? tier : TIERS[tier.index + 1]!;
}
