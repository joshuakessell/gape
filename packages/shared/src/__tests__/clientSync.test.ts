import { describe, expect, it } from 'vitest';
import { prunePending, replayFrom, reconcile, syncMotion } from '../clientSync.js';

const cfg = { sinkTime: 0.5, toppleTime: 0.4 };

describe('reconcile', () => {
  it('pulls the predicted point partway toward the authoritative one', () => {
    expect(reconcile({ x: 0, z: 0 }, { x: 10, z: 0 }, 0.5)).toEqual({ x: 5, z: 0 });
  });
  it('alpha 0 keeps prediction; alpha 1 snaps to authority', () => {
    expect(reconcile({ x: 2, z: 3 }, { x: 9, z: 9 }, 0)).toEqual({ x: 2, z: 3 });
    expect(reconcile({ x: 2, z: 3 }, { x: 9, z: 9 }, 1)).toEqual({ x: 9, z: 9 });
  });
});

describe('syncMotion', () => {
  it('adopts a fresh authoritative animation phase starting at t=0', () => {
    expect(syncMotion({ phase: 'idle', t: 0.7 }, 'sinking', { dt: 0.1, config: cfg })).toEqual({ phase: 'sinking', t: 0 });
  });
  it('renders a server-settled prop fully toppled (t=1), not reset upright', () => {
    expect(syncMotion({ phase: 'toppling', t: 0.8 }, 'settled', { dt: 0.1, config: cfg })).toEqual({ phase: 'settled', t: 1 });
  });
  it('advances local t while a sink animation holds', () => {
    const m = syncMotion({ phase: 'sinking', t: 0 }, 'sinking', { dt: 0.1, config: cfg });
    expect(m.t).toBeCloseTo(0.2);
  });
  it('advances local t at the topple rate while a topple holds', () => {
    const m = syncMotion({ phase: 'toppling', t: 0 }, 'toppling', { dt: 0.1, config: cfg });
    expect(m.phase).toBe('toppling');
    expect(m.t).toBeCloseTo(0.25); // 0.1s / 0.4s topple
  });
  it('clamps t at 1', () => {
    expect(syncMotion({ phase: 'sinking', t: 0.99 }, 'sinking', { dt: 1, config: cfg }).t).toBe(1);
  });
  it('leaves a held static phase untouched', () => {
    expect(syncMotion({ phase: 'gone', t: 1 }, 'gone', { dt: 0.1, config: cfg })).toEqual({ phase: 'gone', t: 1 });
  });
});

const mkInput = (x: number, z: number) => ({ keyDir: { x, z }, target: null });
const stepCtx = { speed: 10, dt: 0.05, bounds: { halfW: 100, halfH: 100 } };

describe('prunePending', () => {
  it('drops inputs at or below ackSeq and keeps newer ones', () => {
    const buf = [1, 2, 3].map((seq) => ({ seq, input: mkInput(1, 0) }));
    expect(prunePending(buf, 2).map((p) => p.seq)).toEqual([3]);
  });
  it('returns empty once everything is acked', () => {
    expect(prunePending([{ seq: 1, input: mkInput(1, 0) }], 1)).toEqual([]);
  });
});

describe('replayFrom', () => {
  it('returns the authoritative base when nothing is pending', () => {
    expect(replayFrom({ x: 5, z: 5 }, [], stepCtx)).toEqual({ x: 5, z: 5 });
  });
  it('re-applies one unacked input from the base (speed*dt = 0.5)', () => {
    const buf = [{ seq: 1, input: mkInput(1, 0) }];
    expect(replayFrom({ x: 0, z: 0 }, buf, stepCtx)).toEqual({ x: 0.5, z: 0 });
  });
  it('stacks multiple unacked inputs', () => {
    const buf = [1, 2].map((seq) => ({ seq, input: mkInput(1, 0) }));
    expect(replayFrom({ x: 0, z: 0 }, buf, stepCtx).x).toBeCloseTo(1);
  });
});
