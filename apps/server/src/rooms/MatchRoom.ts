import { Room, type Client } from '@colyseus/core';

// Phase 0 stub: lifecycle logging only — no schema, no tick.
// P2 wires the authoritative tick loop, schema state, and message handlers here.
export class MatchRoom extends Room {
  override onCreate(options: unknown): void {
    console.log('[match] created', options);
    // P2: define schema state, set patch rate, register message handlers.
  }

  override onJoin(client: Client): void {
    console.log('[match] join', client.sessionId);
  }

  override onLeave(client: Client): void {
    console.log('[match] leave', client.sessionId);
  }

  override onDispose(): void {
    console.log('[match] disposed');
  }
}
