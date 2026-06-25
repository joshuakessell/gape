import { MANIFEST, type PlacedProp, type PropDef, type PropMotion, WORLD, placeProps } from '@gape/shared';

/** Server-side world: deterministic prop layout + authoritative per-prop motion. */
export interface ServerWorld {
  placed: PlacedProp[];
  motion: PropMotion[]; // indexed by uid (placeProps assigns 0..N-1 in order)
  defs: Map<string, PropDef>;
}

export function buildWorld(): ServerWorld {
  const placed = placeProps(MANIFEST, WORLD.bounds, WORLD.seed);
  const motion: PropMotion[] = placed.map(() => ({ phase: 'idle', t: 0 }));
  const defs = new Map(MANIFEST.props.map((d) => [d.id, d]));
  return { placed, motion, defs };
}
