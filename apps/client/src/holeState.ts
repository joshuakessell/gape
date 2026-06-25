import type { Vec2 } from '@gape/shared';

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
