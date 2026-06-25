import type { Bounds } from './movement.js';
import type { ContentManifest, PropDef } from './manifest.js';
import type { Vec2 } from './vec2.js';

/** A concrete prop placed in the world, keyed by a stable uid. */
export interface PlacedProp {
  uid: number;
  defId: string;
  pos: Vec2;
  rotationY: number;
}

interface PlaceCtx {
  rng: () => number;
  bounds: Bounds;
}

/** Deterministic 32-bit PRNG; same seed → same stream (client + future server). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Place one prop with its whole footprint inside the bounds. */
function placeOne(def: PropDef, uid: number, ctx: PlaceCtx): PlacedProp {
  const m = def.footprintRadius;
  const x = (ctx.rng() * 2 - 1) * (ctx.bounds.halfW - m);
  const z = (ctx.rng() * 2 - 1) * (ctx.bounds.halfH - m);
  return { uid, defId: def.id, pos: { x, z }, rotationY: ctx.rng() * Math.PI * 2 };
}

/** Scatter every archetype's spawnCount across the play area from one seed. */
export function placeProps(manifest: ContentManifest, bounds: Bounds, seed: number): PlacedProp[] {
  const ctx: PlaceCtx = { rng: mulberry32(seed), bounds };
  const placed: PlacedProp[] = [];
  let uid = 0;
  for (const def of manifest.props) {
    for (let i = 0; i < def.spawnCount; i++) placed.push(placeOne(def, uid++, ctx));
  }
  return placed;
}
