import { isMoveKey, keysToDir } from '@gape/shared';
import type { ThreeEvent } from '@react-three/fiber';
import { useEffect } from 'react';
import { holeState } from '../holeState';
import { sendInput } from '../net/connection';

/** Tap/click the ground to set a seek target; edge-send it immediately so a
 *  rapid second tap can't overwrite the first before the heartbeat fires. */
function onGroundPointerDown(e: ThreeEvent<PointerEvent>): void {
  holeState.target = { x: e.point.x, z: e.point.z };
  sendInput(keysToDir(holeState.pressed), holeState.target);
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

/** Wires keyboard + tap input. Per-frame integration lives in ServerSync. */
export function useHoleControls(): { onGroundPointerDown: (e: ThreeEvent<PointerEvent>) => void } {
  useEffect(subscribeKeys, []);
  return { onGroundPointerDown };
}
