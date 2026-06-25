import { type GrowthState, type Vec2, WORLD, initialGrowth } from '@gape/shared';

/** Latest client intent the server will integrate (input-only authority). */
export interface PlayerInput {
  dir: Vec2;
  target: Vec2 | null;
  seq: number;
}

/** Authoritative per-player state (never trusts client positions). */
export interface Player {
  pos: Vec2;
  growth: GrowthState;
  input: PlayerInput;
}

export function newPlayer(spawn: Vec2): Player {
  return {
    pos: spawn,
    growth: initialGrowth(WORLD.startRadius),
    input: { dir: { x: 0, z: 0 }, target: null, seq: 0 },
  };
}
