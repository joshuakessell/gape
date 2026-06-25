import { clampDt, keysToDir, isMoveKey, stepHole, type MoveInput } from '@gape/shared';
import type { ThreeEvent } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { useEffect } from 'react';
import { HOLE_SPEED, MAX_DT, PLAY_BOUNDS, holeState } from '../holeState';

/** Tap/click the ground to set a seek target. */
function onGroundPointerDown(e: ThreeEvent<PointerEvent>): void {
  holeState.target = { x: e.point.x, z: e.point.z };
}

function onKey(e: KeyboardEvent, pressed: boolean): void {
  if (!isMoveKey(e.code)) return;
  e.preventDefault();
  if (!pressed) {
    holeState.pressed.delete(e.code);
    return;
  }
  holeState.pressed.add(e.code);
  holeState.target = null; // keyboard cancels an active tap-seek
}

function subscribeKeys(): () => void {
  const down = (e: KeyboardEvent): void => onKey(e, true);
  const up = (e: KeyboardEvent): void => onKey(e, false);
  // Clear held keys on focus loss / tab switch, else a missed keyup leaves the
  // hole drifting (the keyup fires on a window we're no longer listening to).
  const clear = (): void => holeState.pressed.clear();
  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  window.addEventListener('blur', clear);
  document.addEventListener('visibilitychange', clear);
  return () => {
    window.removeEventListener('keydown', down);
    window.removeEventListener('keyup', up);
    window.removeEventListener('blur', clear);
    document.removeEventListener('visibilitychange', clear);
  };
}

function integrate(rawDt: number): void {
  const dt = clampDt(rawDt, MAX_DT);
  const input: MoveInput = { keyDir: keysToDir(holeState.pressed), target: holeState.target };
  holeState.pos = stepHole(holeState.pos, input, { speed: HOLE_SPEED, dt, bounds: PLAY_BOUNDS });
}

/** Wires keyboard + tap input and integrates the hole each frame. */
export function useHoleControls(): { onGroundPointerDown: (e: ThreeEvent<PointerEvent>) => void } {
  useEffect(subscribeKeys, []);
  useFrame((_, dt) => integrate(dt));
  return { onGroundPointerDown };
}
