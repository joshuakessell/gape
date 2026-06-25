import { describe, expect, it } from 'vitest';
import { isMoveKey, keysToDir } from '../controls.js';

describe('controls', () => {
  it('recognizes WASD and arrow keys, rejects others', () => {
    expect(isMoveKey('KeyW')).toBe(true);
    expect(isMoveKey('ArrowRight')).toBe(true);
    expect(isMoveKey('Space')).toBe(false);
  });

  it('maps a single key to a ground direction (up is −z)', () => {
    expect(keysToDir(new Set(['KeyW']))).toEqual({ x: 0, z: -1 });
    expect(keysToDir(new Set(['KeyD']))).toEqual({ x: 1, z: 0 });
  });

  it('sums opposing keys to zero and diagonals to a corner', () => {
    expect(keysToDir(new Set(['KeyW', 'KeyS']))).toEqual({ x: 0, z: 0 });
    expect(keysToDir(new Set(['KeyW', 'KeyD']))).toEqual({ x: 1, z: -1 });
  });

  it('ignores non-movement keys in the pressed set', () => {
    expect(keysToDir(new Set(['Space', 'KeyA']))).toEqual({ x: -1, z: 0 });
  });

  it('returns zero for an empty pressed set', () => {
    expect(keysToDir(new Set())).toEqual({ x: 0, z: 0 });
  });
});
