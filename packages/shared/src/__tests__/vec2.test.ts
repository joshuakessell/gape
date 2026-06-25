import { describe, expect, it } from 'vitest';
import { add, dist2, len, normalize, scale, sub, type Vec2 } from '../vec2.js';

const v = (x: number, z: number): Vec2 => ({ x, z });

describe('vec2', () => {
  it('add / sub combine componentwise', () => {
    expect(add(v(1, 2), v(3, 4))).toEqual(v(4, 6));
    expect(sub(v(3, 4), v(1, 2))).toEqual(v(2, 2));
  });

  it('scale multiplies both axes', () => {
    expect(scale(v(2, -3), 2)).toEqual(v(4, -6));
    const zeroed = scale(v(2, -3), 0);
    expect(zeroed.x === 0 && zeroed.z === 0).toBe(true); // sign-of-zero agnostic
  });

  it('len is the Euclidean magnitude', () => {
    expect(len(v(3, 4))).toBe(5);
    expect(len(v(0, 0))).toBe(0);
  });

  it('dist2 is the planar distance between points', () => {
    expect(dist2(v(0, 0), v(3, 4))).toBe(5);
    expect(dist2(v(1, 1), v(1, 1))).toBe(0);
  });

  it('normalize returns a unit vector, or zero for the zero vector', () => {
    const n = normalize(v(0, 5));
    expect(n).toEqual(v(0, 1));
    expect(len(normalize(v(3, 4)))).toBeCloseTo(1, 12);
    expect(normalize(v(0, 0))).toEqual(v(0, 0));
  });
});
