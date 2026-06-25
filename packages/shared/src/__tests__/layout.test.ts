import { describe, expect, it } from 'vitest';
import { mulberry32, placeProps } from '../layout.js';
import type { ContentManifest } from '../manifest.js';

const manifest: ContentManifest = {
  props: [
    { id: 'cube', shape: 'box', class: 'small', footprintRadius: 0.5, height: 1, topple: false, points: 1, color: '#fff', spawnCount: 3, maxInstances: 10 },
    { id: 'pole', shape: 'cylinder', class: 'medium', footprintRadius: 0.2, height: 4, topple: true, points: 5, color: '#aaa', spawnCount: 2, maxInstances: 10 },
  ],
};
const bounds = { halfW: 20, halfH: 20 };

describe('mulberry32', () => {
  it('is deterministic for a given seed', () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('returns values in [0, 1)', () => {
    const r = mulberry32(7);
    for (let i = 0; i < 200; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('placeProps', () => {
  it('places spawnCount of each archetype', () => {
    const placed = placeProps(manifest, bounds, 42);
    expect(placed.length).toBe(5);
    expect(placed.filter((p) => p.defId === 'cube').length).toBe(3);
    expect(placed.filter((p) => p.defId === 'pole').length).toBe(2);
  });

  it('is deterministic and assigns unique uids', () => {
    const a = placeProps(manifest, bounds, 42);
    const b = placeProps(manifest, bounds, 42);
    expect(a).toEqual(b);
    expect(new Set(a.map((p) => p.uid)).size).toBe(a.length);
  });

  it('keeps every prop footprint inside the play area', () => {
    const placed = placeProps(manifest, bounds, 99);
    for (const p of placed) {
      expect(Math.abs(p.pos.x)).toBeLessThanOrEqual(bounds.halfW);
      expect(Math.abs(p.pos.z)).toBeLessThanOrEqual(bounds.halfH);
    }
  });
});
