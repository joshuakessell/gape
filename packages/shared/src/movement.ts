import type { Vec2 } from './vec2.js';
import { add, len, normalize, scale, sub } from './vec2.js';

/** Half-extents of the play area, centered on the origin. */
export interface Bounds {
  halfW: number;
  halfH: number;
}

export interface MoveInput {
  /** Ground direction from the keyboard (summed, not normalized); zero if none. */
  keyDir: Vec2;
  /** Tap-to-move target, or null when there is none. */
  target: Vec2 | null;
}

export interface StepCtx {
  speed: number;
  dt: number;
  bounds: Bounds;
}

/** Distance under which a tap-seek is considered "arrived" and stops. */
const ARRIVE_EPS = 1e-3;

function clampAxis(v: number, half: number): number {
  return Math.max(-half, Math.min(half, v));
}

/** Clamp a position to the play-area rectangle. */
export function clampToBounds(pos: Vec2, bounds: Bounds): Vec2 {
  return { x: clampAxis(pos.x, bounds.halfW), z: clampAxis(pos.z, bounds.halfH) };
}

function seekDir(pos: Vec2, target: Vec2): Vec2 {
  const to = sub(target, pos);
  return len(to) < ARRIVE_EPS ? { x: 0, z: 0 } : normalize(to);
}

/** Keyboard direction wins; otherwise seek the tap target; else stay put. */
export function desiredDir(pos: Vec2, input: MoveInput): Vec2 {
  if (input.keyDir.x !== 0 || input.keyDir.z !== 0) return normalize(input.keyDir);
  if (input.target) return seekDir(pos, input.target);
  return { x: 0, z: 0 };
}

/** Guard against huge dt (tab refocus / GC pause) so the hole can't teleport. */
export function clampDt(dt: number, maxDt: number): number {
  if (dt < 0) return 0;
  return Math.min(dt, maxDt);
}

/** Step distance: full speed*dt, but never past a tap target (prevents overshoot/jitter). */
function stepLen(pos: Vec2, input: MoveInput, ctx: StepCtx): number {
  const full = ctx.speed * ctx.dt;
  if (input.keyDir.x !== 0 || input.keyDir.z !== 0) return full;
  if (input.target) return Math.min(full, len(sub(input.target, pos)));
  return full;
}

/** Pure one-step integrate along the desired direction, then clamp. */
export function stepHole(pos: Vec2, input: MoveInput, ctx: StepCtx): Vec2 {
  const dir = desiredDir(pos, input);
  const next = add(pos, scale(dir, stepLen(pos, input, ctx)));
  return clampToBounds(next, ctx.bounds);
}
