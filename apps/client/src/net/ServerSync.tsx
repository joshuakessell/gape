import { WORLD, clampDt, keysToDir, type MoveInput, phaseFromCode, reconcile, stepHole, syncMotion } from '@gape/shared';
import { useFrame } from '@react-three/fiber';
import { placedProps, propRuntime } from '../game/propsRuntime';
import { setHud } from '../game/store';
import { holeState } from '../holeState';
import { net, replayTarget, sendInput } from './connection';
import { myHole, propCodes } from './serverView';

const RECONCILE_ALPHA = 0.2;
const SEND_INTERVAL = 1 / 20; // throttle input to the server's 20Hz tick rate
const ANIM = { sinkTime: WORLD.sinkTime, toppleTime: WORLD.toppleTime };
const REPLAY_CTX = { speed: WORLD.holeSpeed, dt: SEND_INTERVAL, bounds: WORLD.bounds };

let sendAccum = 0;

function currentInput(): MoveInput {
  return { keyDir: keysToDir(holeState.pressed), target: holeState.target };
}

function predict(dt: number): void {
  holeState.pos = stepHole(holeState.pos, currentInput(), { speed: WORLD.holeSpeed, dt, bounds: WORLD.bounds });
}

function maybeSend(dt: number): void {
  sendAccum += dt;
  if (sendAccum < SEND_INTERVAL) return;
  sendAccum = Math.min(sendAccum - SEND_INTERVAL, SEND_INTERVAL); // carry remainder, cap backlog
  const input = currentInput();
  sendInput(input.keyDir, input.target);
}

function applyHole(): void {
  const room = net.room;
  if (!room) return;
  const hole = myHole(room);
  if (!hole) return;
  // Snap to the authoritative base, replay still-unacked inputs, then ease in.
  const target = replayTarget({ x: hole.x, z: hole.z }, hole.ackSeq, REPLAY_CTX);
  holeState.pos = reconcile(holeState.pos, target, RECONCILE_ALPHA);
  holeState.radius = hole.radius; // snapped, not eased: growth is monotonic, discrete tier pops
  setHud(hole.score, hole.tier);
}

function applyProps(dt: number): void {
  const room = net.room;
  const codes = room ? propCodes(room) : null;
  if (!codes) return;
  for (const placed of placedProps) {
    const m = propRuntime.get(placed.uid)!;
    const next = syncMotion(m, phaseFromCode(codes[placed.uid] ?? 0), { dt, config: ANIM });
    m.phase = next.phase;
    m.t = next.t;
  }
}

/** Single per-frame netcode driver: predict locally, throttle-send intent, then
 *  fold in authoritative server state (seq-reconciled hole + prop phases). */
export function ServerSync(): null {
  useFrame((_, dt) => {
    const d = clampDt(dt, WORLD.maxDt);
    predict(d);
    maybeSend(d);
    applyHole();
    applyProps(d);
  });
  return null;
}
