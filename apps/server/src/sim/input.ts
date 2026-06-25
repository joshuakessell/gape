import type { Vec2 } from '@gape/shared';

/** Wire shape of a client input (intent only — never positions). */
export interface InputMsg {
  seq: number;
  dirX: number;
  dirZ: number;
  targetX: number | null;
  targetZ: number | null;
}

function finite(v: number): number {
  return Number.isFinite(v) ? v : 0;
}

function clampUnit(v: number): number {
  return v < -1 ? -1 : v > 1 ? 1 : v;
}

/** Sanitised move direction (each axis clamped to [-1,1]; NaN → 0). */
export function inputDir(msg: InputMsg): Vec2 {
  return { x: clampUnit(finite(msg.dirX)), z: clampUnit(finite(msg.dirZ)) };
}

/** Sanitised tap target, or null. Bounds are enforced later by stepHole. */
export function inputTarget(msg: InputMsg): Vec2 | null {
  if (msg.targetX === null || msg.targetZ === null) return null;
  return { x: finite(msg.targetX), z: finite(msg.targetZ) };
}
