import { describe, expect, it } from 'vitest';
import { TIERS } from '../tiers.js';

describe('TIERS', () => {
  it('is the ordered list of named hole sizes', () => {
    expect(TIERS.map((t) => t.name)).toEqual(['pothole', 'manhole', 'sinkhole', 'crater', 'abyss']);
  });

  it('uses contiguous indices matching array position', () => {
    TIERS.forEach((t, i) => expect(t.index).toBe(i));
  });
});
