import type { Object3D } from 'three';
import type { PlacedProp } from '@gape/shared';
import type { PropRuntime } from '../game/propsRuntime';

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
export function writeForPhase(obj: Object3D, placed: PlacedProp, rt: PropRuntime): void {
  if (rt.phase === 'gone') {
    obj.scale.setScalar(HIDDEN);
    return;
  }
  if (rt.phase === 'sinking') return writeSinking(obj, placed, clamp01(rt.t));
  if (rt.phase === 'toppling' || rt.phase === 'settled') return writeToppling(obj, placed, clamp01(rt.t));
  return writeIdle(obj, placed);
}
