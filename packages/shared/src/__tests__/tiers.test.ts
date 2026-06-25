import { describe, expect, it } from 'vitest';
import { advanceTier, isMaxTier, TIERS, tierAt } from '../tiers.js';

describe('tiers', () => {
  it('tierAt picks the highest tier reached', () => {
    expect(tierAt(0).name).toBe('pothole');
    expect(tierAt(1.9).name).toBe('pothole');
    expect(tierAt(2).name).toBe('manhole');
    expect(tierAt(999).name).toBe('abyss');
  });

  it('tierAt clamps below the first threshold to tier 0', () => {
    expect(tierAt(-5).index).toBe(0);
  });

  it('isMaxTier is true only for the last tier', () => {
    expect(isMaxTier(TIERS[0]!)).toBe(false);
    expect(isMaxTier(TIERS[TIERS.length - 1]!)).toBe(true);
  });

  it('advanceTier steps up, then saturates at max', () => {
    expect(advanceTier(TIERS[0]!).index).toBe(1);
    const max = TIERS[TIERS.length - 1]!;
    expect(advanceTier(max)).toBe(max);
  });
});
