import type { Bounds, Vec2 } from '@gape/shared';

/**
 * Mutable singleton driving the scene. This is deliberately NOT React state:
 * it changes every frame and is read inside useFrame, so keeping it out of React
 * avoids per-frame re-renders (the #1 R3F perf cliff).
 */
export interface HoleState {
  pos: Vec2;
  radius: number;
  pressed: Set<string>;
  target: Vec2 | null;
}

export const holeState: HoleState = {
  pos: { x: 0, z: 0 },
  radius: 1.5,
  pressed: new Set<string>(),
  target: null,
};

/** Play-area half-extents (centered on origin); the hole clamps to these. */
export const PLAY_BOUNDS: Bounds = { halfW: 24, halfH: 24 };

/** Hole travel speed in world units per second. */
export const HOLE_SPEED = 12;

/** Cap a single frame's dt so a tab refocus can't teleport the hole. */
export const MAX_DT = 0.05;
