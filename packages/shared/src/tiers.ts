/** A growth tier the hole passes through; the index labels its size. */
export interface Tier {
  index: number;
  name: string;
}

// growth.ts advances tier by item count and uses growth.state.tier as the index
// into this list; the HUD reads TIERS[tier].name. (No radius thresholds here —
// the hole's radius is a continuous value owned by GrowthState.)
export const TIERS: readonly Tier[] = [
  { index: 0, name: 'pothole' },
  { index: 1, name: 'manhole' },
  { index: 2, name: 'sinkhole' },
  { index: 3, name: 'crater' },
  { index: 4, name: 'abyss' },
];
