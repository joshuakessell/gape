import type { Vec2 } from './vec2.js';
import { dist2 } from './vec2.js';

/** A circle on the ground: the hole, or an object's footprint. */
export interface Disc {
  center: Vec2;
  r: number;
}

/** The swallow rule: object fits when dist(centers) + obj.r ≤ hole.r. */
export function fitsInHole(hole: Disc, obj: Disc): boolean {
  return dist2(hole.center, obj.center) + obj.r <= hole.r;
}

/** 0 when the object's near edge is at the rim, 1 once fully swallowed. */
export function containment(hole: Disc, obj: Disc): number {
  if (hole.r <= 0) return 0;
  const d = dist2(hole.center, obj.center);
  if (obj.r <= 0) return d <= hole.r ? 1 : 0;
  const frac = (hole.r - (d - obj.r)) / (2 * obj.r);
  return Math.max(0, Math.min(1, frac));
}
