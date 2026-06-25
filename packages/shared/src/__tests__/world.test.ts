import { describe, expect, it } from 'vitest';
import { MANIFEST } from '../content.js';
import { WORLD } from '../world.js';

describe('WORLD config', () => {
  it('defines a centered play area and a positive starting radius', () => {
    expect(WORLD.bounds.halfW).toBeGreaterThan(0);
    expect(WORLD.bounds.halfH).toBeGreaterThan(0);
    expect(WORLD.startRadius).toBeGreaterThan(0);
    expect(WORLD.holeSpeed).toBeGreaterThan(0);
  });
});

describe('MANIFEST', () => {
  it('lists props with positive footprints and points', () => {
    expect(MANIFEST.props.length).toBeGreaterThan(0);
    for (const p of MANIFEST.props) {
      expect(p.footprintRadius).toBeGreaterThan(0);
      expect(p.points).toBeGreaterThan(0);
    }
  });
});
