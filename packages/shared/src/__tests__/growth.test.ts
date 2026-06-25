import { describe, expect, it } from 'vitest';
import { applyEaten, initialGrowth, itemsToGrowAt } from '../growth.js';

describe('growth', () => {
  it('starts at the given radius, tier 0, zero score', () => {
    const s = initialGrowth(1.5);
    expect(s).toEqual({ radius: 1.5, score: 0, tier: 0, eatenThisTier: 0 });
  });

  it('requires more items to grow at higher tiers', () => {
    expect(itemsToGrowAt(1)).toBeGreaterThan(itemsToGrowAt(0));
    expect(itemsToGrowAt(2)).toBeGreaterThan(itemsToGrowAt(1));
  });

  it('accumulates score and items below the threshold without growing', () => {
    let s = initialGrowth(1.5);
    s = applyEaten(s, 3);
    expect(s.score).toBe(3);
    expect(s.eatenThisTier).toBe(1);
    expect(s.radius).toBe(1.5);
    expect(s.tier).toBe(0);
  });

  it('grows radius + tier at the threshold and resets the counter', () => {
    let s = initialGrowth(1.5);
    const need = itemsToGrowAt(0);
    for (let i = 0; i < need; i++) s = applyEaten(s, 1);
    expect(s.tier).toBe(1);
    expect(s.radius).toBeGreaterThan(1.5);
    expect(s.eatenThisTier).toBe(0);
    expect(s.score).toBe(need);
  });

  it('never advances past the final tier', () => {
    let s = initialGrowth(1.5);
    for (let i = 0; i < 1000; i++) s = applyEaten(s, 1);
    expect(s.tier).toBe(4);
  });
});
