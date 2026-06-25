import { TIERS } from './tiers.js';

/** Running state of one hole's score and growth. */
export interface GrowthState {
  radius: number;
  score: number;
  tier: number;
  eatenThisTier: number;
}

const BASE_ITEMS = 8;
const PER_TIER_ITEMS = 4;
const GROW_FACTOR = 1.6;

/** Fresh growth state at a starting radius. */
export function initialGrowth(radius: number): GrowthState {
  return { radius, score: 0, tier: 0, eatenThisTier: 0 };
}

/** Items needed to grow out of a tier — rises with each tier. */
export function itemsToGrowAt(tier: number): number {
  return BASE_ITEMS + tier * PER_TIER_ITEMS;
}

function atMaxTier(tier: number): boolean {
  return tier >= TIERS.length - 1;
}

/** Add a swallowed prop's points; grow radius + tier once the threshold is hit. */
export function applyEaten(state: GrowthState, points: number): GrowthState {
  const score = state.score + points;
  const eaten = state.eatenThisTier + 1;
  if (!atMaxTier(state.tier) && eaten >= itemsToGrowAt(state.tier)) {
    return { radius: state.radius * GROW_FACTOR, score, tier: state.tier + 1, eatenThisTier: 0 };
  }
  return { radius: state.radius, score, tier: state.tier, eatenThisTier: eaten };
}
