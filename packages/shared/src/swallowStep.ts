import { type Disc, fitsInHole } from './footprint.js';
import { type PropQuery, classifySwallow } from './swallow.js';

/** Lifecycle of a prop as the hole works on it. */
export type PropPhase = 'idle' | 'sinking' | 'toppling' | 'settled' | 'gone';

/** Mutable per-prop animation/scoring state. */
export interface PropMotion {
  phase: PropPhase;
  t: number;
}

/** Animation durations (seconds). */
export interface StepConfig {
  sinkTime: number;
  toppleTime: number;
}

/** Everything one frame's transition depends on. */
export interface StepInput {
  hole: Disc;
  prop: PropQuery;
  dt: number;
  config: StepConfig;
}

/** Next phase/progress and whether this frame completed a scoring swallow. */
export interface StepResult {
  phase: PropPhase;
  t: number;
  scored: boolean;
}

function fromIdle(hole: Disc, prop: PropQuery): StepResult {
  const verdict = classifySwallow(hole, prop);
  if (verdict === 'swallow') return { phase: 'sinking', t: 0, scored: false };
  if (verdict === 'topple') return { phase: 'toppling', t: 0, scored: false };
  return { phase: 'idle', t: 0, scored: false };
}

/** A toppled prop becomes edible again only once the grown hole fully engulfs it. */
function fromSettled(hole: Disc, prop: PropQuery): StepResult {
  const fits = fitsInHole(hole, { center: prop.center, r: prop.footprintRadius });
  return { phase: fits ? 'sinking' : 'settled', t: fits ? 0 : 1, scored: false };
}

function advanceSinking(t: number, dt: number, sinkTime: number): StepResult {
  const next = t + dt / sinkTime;
  if (next < 1) return { phase: 'sinking', t: next, scored: false };
  return { phase: 'gone', t: 0, scored: true };
}

function advanceToppling(t: number, dt: number, toppleTime: number): StepResult {
  const next = t + dt / toppleTime;
  if (next < 1) return { phase: 'toppling', t: next, scored: false };
  return { phase: 'settled', t: 1, scored: false };
}

/** Pure per-prop state machine: one frame's transition + whether it scored. */
export function stepProp(motion: PropMotion, input: StepInput): StepResult {
  switch (motion.phase) {
    case 'idle':
      return fromIdle(input.hole, input.prop);
    case 'settled':
      return fromSettled(input.hole, input.prop);
    case 'sinking':
      return advanceSinking(motion.t, input.dt, input.config.sinkTime);
    case 'toppling':
      return advanceToppling(motion.t, input.dt, input.config.toppleTime);
    default:
      return { phase: 'gone', t: motion.t, scored: false };
  }
}
