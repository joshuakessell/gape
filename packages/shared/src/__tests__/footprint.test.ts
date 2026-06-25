import { describe, expect, it } from 'vitest';
import { containment, type Disc, fitsInHole } from '../footprint.js';

const disc = (x: number, z: number, r: number): Disc => ({ center: { x, z }, r });

describe('fitsInHole', () => {
  it('swallows an object fully inside the hole', () => {
    expect(fitsInHole(disc(0, 0, 5), disc(0, 0, 2))).toBe(true);
  });

  it('rejects an object whose far edge pokes out', () => {
    expect(fitsInHole(disc(0, 0, 5), disc(4, 0, 2))).toBe(false);
  });

  it('treats the exact tangent-inside case as fitting (≤)', () => {
    // dist 3 + obj.r 2 === hole.r 5
    expect(fitsInHole(disc(0, 0, 5), disc(3, 0, 2))).toBe(true);
  });
});

describe('containment', () => {
  it('is 1 when fully swallowed', () => {
    expect(containment(disc(0, 0, 5), disc(0, 0, 1))).toBe(1);
  });

  it('is 0 when the near edge is at (or past) the rim', () => {
    expect(containment(disc(0, 0, 5), disc(7, 0, 2))).toBe(0); // near edge at rim
    expect(containment(disc(0, 0, 5), disc(20, 0, 2))).toBe(0); // far away
  });

  it('ramps linearly between rim-touch and fully-in', () => {
    // near edge crosses at d=7, fully in at d=3; midpoint d=5 → 0.5
    expect(containment(disc(0, 0, 5), disc(5, 0, 2))).toBeCloseTo(0.5, 12);
  });

  it('handles a degenerate (zero-radius) hole', () => {
    expect(containment(disc(0, 0, 0), disc(0, 0, 1))).toBe(0);
  });

  it('handles a point object as a step function', () => {
    expect(containment(disc(0, 0, 5), disc(3, 0, 0))).toBe(1);
    expect(containment(disc(0, 0, 5), disc(6, 0, 0))).toBe(0);
  });
});
