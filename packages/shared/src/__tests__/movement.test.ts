import { describe, expect, it } from 'vitest';
import {
  type Bounds,
  clampDt,
  clampToBounds,
  desiredDir,
  type MoveInput,
  stepHole,
} from '../movement.js';
import { len } from '../vec2.js';

const bounds: Bounds = { halfW: 10, halfH: 8 };
const input = (over: Partial<MoveInput> = {}): MoveInput => ({ keyDir: { x: 0, z: 0 }, target: null, ...over });

describe('clampToBounds', () => {
  it('passes through a position inside the rectangle', () => {
    expect(clampToBounds({ x: 3, z: -4 }, bounds)).toEqual({ x: 3, z: -4 });
  });

  it('clamps each axis to its half-extent independently', () => {
    expect(clampToBounds({ x: 99, z: -99 }, bounds)).toEqual({ x: 10, z: -8 });
  });
});

describe('desiredDir', () => {
  it('normalizes the keyboard direction', () => {
    expect(len(desiredDir({ x: 0, z: 0 }, input({ keyDir: { x: 1, z: 1 } })))).toBeCloseTo(1, 12);
  });

  it('lets the keyboard win over an active tap target', () => {
    const d = desiredDir({ x: 0, z: 0 }, input({ keyDir: { x: 1, z: 0 }, target: { x: 0, z: 5 } }));
    expect(d).toEqual({ x: 1, z: 0 });
  });

  it('seeks the tap target when no key is pressed', () => {
    const d = desiredDir({ x: 0, z: 0 }, input({ target: { x: 0, z: 10 } }));
    expect(d).toEqual({ x: 0, z: 1 });
  });

  it('stays put with no input', () => {
    expect(desiredDir({ x: 0, z: 0 }, input())).toEqual({ x: 0, z: 0 });
  });

  it('stops when already on the tap target', () => {
    expect(desiredDir({ x: 2, z: 2 }, input({ target: { x: 2, z: 2 } }))).toEqual({ x: 0, z: 0 });
  });
});

describe('clampDt', () => {
  it('caps a large dt', () => {
    expect(clampDt(5, 0.1)).toBe(0.1);
  });
  it('passes through a small dt and floors negatives', () => {
    expect(clampDt(0.016, 0.1)).toBe(0.016);
    expect(clampDt(-1, 0.1)).toBe(0);
  });
});

describe('stepHole', () => {
  it('integrates one step along the keyboard direction', () => {
    const next = stepHole({ x: 0, z: 0 }, input({ keyDir: { x: 1, z: 0 } }), { speed: 10, dt: 0.1, bounds });
    expect(next).toEqual({ x: 1, z: 0 });
  });

  it('clamps the integrated position to the bounds', () => {
    const next = stepHole({ x: 9.5, z: 0 }, input({ keyDir: { x: 1, z: 0 } }), { speed: 100, dt: 1, bounds });
    expect(next).toEqual({ x: 10, z: 0 });
  });

  it('is deterministic and a no-op with zero input', () => {
    const ctx = { speed: 10, dt: 0.1, bounds };
    const a = stepHole({ x: 2, z: 3 }, input(), ctx);
    const b = stepHole({ x: 2, z: 3 }, input(), ctx);
    expect(a).toEqual({ x: 2, z: 3 });
    expect(a).toEqual(b);
  });

  it('never overshoots a near tap target in one step', () => {
    const next = stepHole({ x: 0, z: 0 }, input({ target: { x: 0.5, z: 0 } }), { speed: 12, dt: 1, bounds });
    expect(next).toEqual({ x: 0.5, z: 0 }); // lands exactly, no overshoot
  });

  it('converges onto a tap target and then stops (no oscillation)', () => {
    const ctx = { speed: 12, dt: 1 / 60, bounds };
    const target = { x: 1.5, z: -1 };
    let pos = { x: 0, z: 0 };
    for (let i = 0; i < 300; i++) pos = stepHole(pos, input({ target }), ctx);
    expect(pos.x).toBeCloseTo(1.5, 6);
    expect(pos.z).toBeCloseTo(-1, 6);
    expect(stepHole(pos, input({ target }), ctx)).toEqual(pos); // settled, no jitter
  });
});
