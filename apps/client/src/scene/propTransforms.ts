import type { Object3D } from 'three';
import type { PlacedProp, PropMotion } from '@gape/shared';

const HIDDEN = 0.0001;

function clamp01(t: number): number {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

function writeIdle(obj: Object3D, placed: PlacedProp): void {
  obj.position.set(placed.pos.x, 0, placed.pos.z);
  obj.rotation.set(0, placed.rotationY, 0);
  obj.scale.setScalar(1);
}

function writeSinking(obj: Object3D, placed: PlacedProp, t: number): void {
  writeIdle(obj, placed);
  obj.position.y = -t * 3; // descend below the opaque ground = swallowed
  obj.scale.setScalar(1 - t * 0.4);
}

function writeToppling(obj: Object3D, placed: PlacedProp, t: number): void {
  writeIdle(obj, placed);
  obj.rotation.x = (t * Math.PI) / 2; // tip over to lie flat, no points
}

/** Compose this prop's instance transform for its current phase. */
export function writeForPhase(obj: Object3D, placed: PlacedProp, motion: PropMotion): void {
  if (motion.phase === 'gone') {
    writeIdle(obj, placed); // self-contained hidden transform (no stale scratch reuse)
    obj.scale.setScalar(HIDDEN);
    return;
  }
  if (motion.phase === 'sinking') return writeSinking(obj, placed, clamp01(motion.t));
  if (motion.phase === 'toppling' || motion.phase === 'settled') return writeToppling(obj, placed, clamp01(motion.t));
  return writeIdle(obj, placed);
}
