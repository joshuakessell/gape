import type { Vec2 } from './vec2.js';

/** KeyboardEvent.code → ground direction. Up (W/↑) is −z (away from camera). */
const KEY_VECTORS: Readonly<Record<string, Vec2>> = {
  KeyW: { x: 0, z: -1 },
  ArrowUp: { x: 0, z: -1 },
  KeyS: { x: 0, z: 1 },
  ArrowDown: { x: 0, z: 1 },
  KeyA: { x: -1, z: 0 },
  ArrowLeft: { x: -1, z: 0 },
  KeyD: { x: 1, z: 0 },
  ArrowRight: { x: 1, z: 0 },
};

export function isMoveKey(code: string): boolean {
  return code in KEY_VECTORS;
}

/** Sum the currently-pressed movement keys into one ground direction. */
export function keysToDir(pressed: ReadonlySet<string>): Vec2 {
  const dir: Vec2 = { x: 0, z: 0 };
  for (const code of pressed) {
    const v = KEY_VECTORS[code];
    if (v) {
      dir.x += v.x;
      dir.z += v.z;
    }
  }
  return dir;
}

export { KEY_VECTORS };
