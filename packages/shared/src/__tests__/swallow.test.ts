import { describe, expect, it } from 'vitest';
import { classifySwallow } from '../swallow.js';

const hole = { center: { x: 0, z: 0 }, r: 2 };

describe('classifySwallow', () => {
  it('swallows a prop whose footprint fits fully inside the hole', () => {
    expect(classifySwallow(hole, { center: { x: 0, z: 0 }, footprintRadius: 0.5, topple: false })).toBe('swallow');
  });

  it('returns none for a prop far from the hole', () => {
    expect(classifySwallow(hole, { center: { x: 10, z: 0 }, footprintRadius: 0.5, topple: false })).toBe('none');
  });

  it('topples a tall prop the hole only partly underlaps', () => {
    expect(classifySwallow(hole, { center: { x: 2, z: 0 }, footprintRadius: 0.5, topple: true })).toBe('topple');
  });

  it('leaves a short prop partly over the hole untouched (no topple)', () => {
    expect(classifySwallow(hole, { center: { x: 2, z: 0 }, footprintRadius: 0.5, topple: false })).toBe('none');
  });

  it('does not topple a tall prop that is fully outside (no overlap)', () => {
    expect(classifySwallow(hole, { center: { x: 3, z: 0 }, footprintRadius: 0.5, topple: true })).toBe('none');
  });
});
