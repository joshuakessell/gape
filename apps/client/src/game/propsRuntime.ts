import { type GrowthState, type PlacedProp, type PropMotion, initialGrowth, placeProps } from '@gape/shared';
import { MANIFEST } from '../content/manifest';
import { PLAY_BOUNDS, holeState } from '../holeState';

const SEED = 1337;

/** Deterministic world layout (same seed → same scatter on every load). */
export const placedProps: PlacedProp[] = placeProps(MANIFEST, PLAY_BOUNDS, SEED);

/** Per-prop motion/scoring phase, keyed by uid (see @gape/shared stepProp). */
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

/** Mutable growth (score/radius/tier) for the local hole. */
export const growth: { state: GrowthState } = { state: initialGrowth(holeState.radius) };
