import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { MatchRoom } from './rooms/MatchRoom.js';

const PORT = Number(process.env.PORT ?? 2567);

const gameServer = new Server({ transport: new WebSocketTransport() });
gameServer.define('match', MatchRoom);

gameServer
  .listen(PORT)
  .then(() => console.log(`[gape] match server listening on :${PORT}`))
  .catch((err: unknown) => {
    console.error('[gape] failed to start', err);
    process.exitCode = 1;
  });
