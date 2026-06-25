import { Server } from '@colyseus/core';
import { MatchRoom } from './rooms/MatchRoom.js';

// Phase 0: compile-only stub. We depend on @colyseus/core (pure npm) rather than
// the `colyseus` meta-package, whose default uWebSockets transport pulls a git
// dependency. P2 attaches a transport (@colyseus/ws-transport), the authoritative
// tick loop, and state sync.
const rawPort = process.env.PORT;
const parsedPort = Number.parseInt(rawPort ?? '', 10);
const port = Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? parsedPort : 2567;
if (rawPort !== undefined && port !== parsedPort) {
  console.warn(`[gape] invalid PORT="${rawPort}"; using ${port}`);
}

const gameServer = new Server();
gameServer.define('match', MatchRoom);

gameServer
  .listen(port)
  .then(() => console.log(`[gape] match server listening on :${port}`))
  .catch((err: unknown) => {
    console.error('[gape] failed to start', err);
    process.exitCode = 1;
  });
