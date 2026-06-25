/** Primitive render shape for a Phase 1 prop (real GLB assets swap in later). */
export type PropShape = 'box' | 'cylinder' | 'cone';

/** Size class; gates which props a given hole tier can swallow. */
export type PropClass = 'small' | 'medium' | 'large' | 'huge';

/** One prop archetype: how it looks, how big its ground footprint is, its worth. */
export interface PropDef {
  id: string;
  shape: PropShape;
  class: PropClass;
  /** Radius of the ground footprint — the circle that must fit inside the hole. */
  footprintRadius: number;
  height: number;
  /** Tall props tip over (no points) when the hole is only partly under them. */
  topple: boolean;
  points: number;
  color: string;
  /** How many to scatter in the world for Phase 1. */
  spawnCount: number;
  /** Upper bound on live instances (sizes the InstancedMesh buffer). */
  maxInstances: number;
}

/** The full set of prop archetypes available to a map. */
export interface ContentManifest {
  props: PropDef[];
}
