import { type MoveInput, type StepCtx, stepHole } from './movement.js';
import type { PropMotion, PropPhase, StepConfig } from './swallowStep.js';
import type { Vec2 } from './vec2.js';

/** Smoothly pull a predicted position toward the authoritative one (alpha 0..1). */
export function reconcile(predicted: Vec2, authoritative: Vec2, alpha: number): Vec2 {
  return {
    x: predicted.x + (authoritative.x - predicted.x) * alpha,
    z: predicted.z + (authoritative.z - predicted.z) * alpha,
  };
}

// Where a prop's local animation starts when the server hands us a new phase:
// fresh anims begin at 0; an already-finished topple (settled) renders flat (1).
const START_T: Readonly<Record<PropPhase, number>> = { idle: 0, sinking: 0, toppling: 0, settled: 1, gone: 1 };

function clamp1(t: number): number {
  return t > 1 ? 1 : t;
}

/** Drive a client prop's animation from the authoritative phase: adopt phase
 *  changes, then advance t locally while a sink/topple animation plays out. */
export function syncMotion(local: PropMotion, authPhase: PropPhase, ctx: { dt: number; config: StepConfig }): PropMotion {
  if (authPhase !== local.phase) return { phase: authPhase, t: START_T[authPhase] };
  if (authPhase === 'sinking') return { phase: authPhase, t: clamp1(local.t + ctx.dt / ctx.config.sinkTime) };
  if (authPhase === 'toppling') return { phase: authPhase, t: clamp1(local.t + ctx.dt / ctx.config.toppleTime) };
  return local;
}

export interface PendingInput {
  seq: number;
  input: MoveInput;
}

/** Drop inputs the server has already applied (seq <= ackSeq). */
export function prunePending(pending: PendingInput[], ackSeq: number): PendingInput[] {
  return pending.filter((p) => p.seq > ackSeq);
}

/** Re-apply still-unacked inputs onto the authoritative base to rebuild the
 *  predicted position (each advanced by one nominal send slice via ctx.dt). */
export function replayFrom(authPos: Vec2, pending: PendingInput[], ctx: StepCtx): Vec2 {
  let pos = authPos;
  for (const p of pending) pos = stepHole(pos, p.input, ctx);
  return pos;
}
