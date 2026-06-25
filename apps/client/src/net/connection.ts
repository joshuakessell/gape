import { type PendingInput, type StepCtx, type Vec2, prunePending, replayFrom } from '@gape/shared';
import { Client, type Room } from 'colyseus.js';
import { setConnected } from '../game/store';

/** WebSocket URL of the authoritative server, derived from the page origin so a
 *  phone on the LAN targets the same machine and https pages use wss. */
function serverUrl(): string {
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = window.location.hostname || 'localhost';
  return `${proto}://${host}:2567`;
}

interface Net {
  room: Room | null;
}

export const net: Net = { room: null };

let seq = 0;
let joining: Promise<void> | null = null;
let pending: PendingInput[] = [];
let retryMs = 1000;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

async function join(): Promise<void> {
  try {
    net.room = await new Client(serverUrl()).joinOrCreate('match');
    net.room.onLeave(onDisconnect);
    retryMs = 1000;
    setConnected(true);
  } catch {
    onDisconnect();
  } finally {
    joining = null;
  }
}

/** Connect once and join the match room; dedupes concurrent (StrictMode) calls. */
export function connect(): Promise<void> {
  if (net.room) return Promise.resolve();
  joining ??= join();
  return joining;
}

function scheduleReconnect(): void {
  if (retryTimer) return;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    void connect();
  }, retryMs);
  retryMs = Math.min(retryMs * 2, 10000);
}

function onDisconnect(): void {
  net.room = null;
  pending = [];
  setConnected(false);
  scheduleReconnect();
}

function toInputMsg(dir: Vec2, target: Vec2 | null) {
  return { seq: ++seq, dirX: dir.x, dirZ: dir.z, targetX: target ? target.x : null, targetZ: target ? target.z : null };
}

/** Send a movement intent and buffer it for seq-based reconciliation replay. */
export function sendInput(dir: Vec2, target: Vec2 | null): void {
  if (!net.room) return;
  const msg = toInputMsg(dir, target);
  pending.push({ seq: msg.seq, input: { keyDir: dir, target } });
  if (pending.length > 120) pending.shift();
  net.room.send('input', msg);
}

/** Reconciliation target: drop server-acked inputs, replay the rest from base. */
export function replayTarget(authPos: Vec2, ackSeq: number, ctx: StepCtx): Vec2 {
  pending = prunePending(pending, ackSeq);
  return replayFrom(authPos, pending, ctx);
}
