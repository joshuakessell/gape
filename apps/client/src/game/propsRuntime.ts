import { MANIFEST, type PlacedProp, type PropMotion, WORLD, placeProps } from '@gape/shared';

/** Deterministic layout built from the shared seed/bounds, so every client and
 *  the server agree on uid → position (the server only syncs phase codes). */
export const placedProps: PlacedProp[] = placeProps(MANIFEST, WORLD.bounds, WORLD.seed);

/** Per-prop animation phase, keyed by uid; driven by the server via syncMotion. */
export const propRuntime = new Map<number, PropMotion>(
  placedProps.map((p): [number, PropMotion] => [p.uid, { phase: 'idle', t: 0 }]),
);

function groupByDef(all: PlacedProp[]): Map<string, PlacedProp[]> {
  const map = new Map<string, PlacedProp[]>();
  for (const p of all) {
    const list = map.get(p.defId) ?? [];
    list.push(p);
    map.set(p.defId, list);
  }
  return map;
}

/** Placed props grouped by archetype, so each InstancedMesh owns its slice. */
export const propsByDef: Map<string, PlacedProp[]> = groupByDef(placedProps);
