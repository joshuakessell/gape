import type { Bounds } from './movement.js';

/** Canonical match constants shared by the client (prediction) and server (authority). */
export interface WorldConfig {
  seed: number;
  bounds: Bounds;
  holeSpeed: number;
  startRadius: number;
  maxDt: number;
  sinkTime: number;
  toppleTime: number;
}

export const WORLD: WorldConfig = {
  seed: 1337,
  bounds: { halfW: 24, halfH: 24 },
  holeSpeed: 12,
  startRadius: 1.5,
  maxDt: 0.05,
  sinkTime: 0.5,
  toppleTime: 0.4,
};
