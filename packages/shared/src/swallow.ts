import { type Disc, fitsInHole } from './footprint.js';
import { dist2 } from './vec2.js';
import type { Vec2 } from './vec2.js';

/** What the hole does to a prop this frame. */
export type SwallowVerdict = 'swallow' | 'topple' | 'none';

/** The bits of a prop the swallow test needs. */
export interface PropQuery {
  center: Vec2;
  footprintRadius: number;
  topple: boolean;
}

function discsOverlap(a: Disc, b: Disc): boolean {
  return dist2(a.center, b.center) < a.r + b.r;
}

/**
 * Fully inside the hole → swallow. Otherwise a tall prop the hole partly
 * underlaps → topple (no points). Else nothing happens.
 */
export function classifySwallow(hole: Disc, prop: PropQuery): SwallowVerdict {
  const obj: Disc = { center: prop.center, r: prop.footprintRadius };
  if (fitsInHole(hole, obj)) return 'swallow';
  if (prop.topple && discsOverlap(hole, obj)) return 'topple';
  return 'none';
}
