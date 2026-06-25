import { describe, expect, it } from 'vitest';
import { type StepInput, stepProp } from '../swallowStep.js';

const config = { sinkTime: 0.5, toppleTime: 0.4 };
const disc = (r: number, x = 0) => ({ center: { x, z: 0 }, r });
const propAt = (x: number) => ({ center: { x, z: 0 }, footprintRadius: 0.5, topple: true });
const input = (hole: StepInput['hole'], prop: StepInput['prop'], dt = 0.1): StepInput => ({ hole, prop, dt, config });

describe('stepProp — idle', () => {
  it('starts sinking when the prop fits fully inside the hole', () => {
    expect(stepProp({ phase: 'idle', t: 0 }, input(disc(2), propAt(0))).phase).toBe('sinking');
  });
  it('starts toppling a tall prop the hole only partly underlaps', () => {
    expect(stepProp({ phase: 'idle', t: 0 }, input(disc(2), propAt(2))).phase).toBe('toppling');
  });
  it('stays idle when the prop is far away', () => {
    expect(stepProp({ phase: 'idle', t: 0 }, input(disc(2), propAt(10))).phase).toBe('idle');
  });
});

describe('stepProp — timed phases', () => {
  it('keeps sinking (no score) until t reaches 1', () => {
    const r = stepProp({ phase: 'sinking', t: 0 }, input(disc(2), propAt(0)));
    expect(r.phase).toBe('sinking');
    expect(r.scored).toBe(false);
  });
  it('goes gone and scores when sinking completes', () => {
    const r = stepProp({ phase: 'sinking', t: 0.99 }, input(disc(2), propAt(0)));
    expect(r.phase).toBe('gone');
    expect(r.scored).toBe(true);
  });
  it('keeps toppling (no score) until it finishes', () => {
    const r = stepProp({ phase: 'toppling', t: 0 }, input(disc(2), propAt(2)));
    expect(r.phase).toBe('toppling');
    expect(r.scored).toBe(false);
  });
  it('settles when toppling completes, without scoring', () => {
    const r = stepProp({ phase: 'toppling', t: 0.99 }, input(disc(2), propAt(2)));
    expect(r.phase).toBe('settled');
    expect(r.scored).toBe(false);
  });
});

describe('stepProp — settled re-swallow (review fix)', () => {
  it('sinks a settled prop once the grown hole fully contains it', () => {
    expect(stepProp({ phase: 'settled', t: 1 }, input(disc(5), propAt(0))).phase).toBe('sinking');
  });
  it('stays settled while the hole still cannot contain it', () => {
    expect(stepProp({ phase: 'settled', t: 1 }, input(disc(2), propAt(2))).phase).toBe('settled');
  });
});

describe('stepProp — gone is terminal', () => {
  it('stays gone and never scores again', () => {
    const r = stepProp({ phase: 'gone', t: 0 }, input(disc(5), propAt(0)));
    expect(r.phase).toBe('gone');
    expect(r.scored).toBe(false);
  });
});
