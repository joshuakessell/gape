import { Room, type Client } from '@colyseus/core';
import { WORLD, phaseToCode } from '@gape/shared';
import { type InputMsg, inputDir, inputTarget } from '../sim/input.js';
import { type Player, newPlayer } from '../sim/player.js';
import { stepWorld } from '../sim/tick.js';
import { type ServerWorld, buildWorld } from '../sim/world.js';
import { HoleState, MatchState } from '../state/schema.js';

const TICK_HZ = 20;
const SPAWN = { x: 0, z: 0 };

/** Authoritative match: clients send input only; the server simulates at 20Hz
 *  reusing the @gape/shared reducers and syncs delta state via @colyseus/schema. */
export class MatchRoom extends Room<MatchState> {
  private world: ServerWorld = buildWorld();
  private players = new Map<string, Player>();

  override onCreate(): void {
    this.state = new MatchState();
    this.state.seed = WORLD.seed;
    for (const m of this.world.motion) this.state.props.push(phaseToCode(m.phase));
    this.onMessage('input', (client, msg: InputMsg) => this.applyInput(client.sessionId, msg));
    this.setSimulationInterval((dt) => this.tick(dt / 1000), 1000 / TICK_HZ);
  }

  override onJoin(client: Client): void {
    this.players.set(client.sessionId, newPlayer({ ...SPAWN }));
    const hole = new HoleState();
    hole.radius = WORLD.startRadius;
    this.state.holes.set(client.sessionId, hole);
  }

  override onLeave(client: Client): void {
    this.players.delete(client.sessionId);
    this.state.holes.delete(client.sessionId);
  }

  private applyInput(id: string, msg: InputMsg): void {
    const player = this.players.get(id);
    if (!player) return;
    player.input = { dir: inputDir(msg), target: inputTarget(msg), seq: msg.seq | 0 };
  }

  private tick(dt: number): void {
    for (const [id, player] of this.players) {
      stepWorld(this.world, player, dt);
      this.syncHole(id, player);
    }
    this.syncProps();
  }

  private syncHole(id: string, player: Player): void {
    const hole = this.state.holes.get(id);
    if (!hole) return;
    hole.x = player.pos.x;
    hole.z = player.pos.z;
    hole.radius = player.growth.radius;
    hole.score = player.growth.score;
    hole.tier = player.growth.tier;
    hole.ackSeq = player.input.seq;
  }

  private syncProps(): void {
    const props = this.state.props;
    for (let uid = 0; uid < this.world.motion.length; uid++) {
      const code = phaseToCode(this.world.motion[uid]!.phase);
      if (props[uid] !== code) props[uid] = code;
    }
  }
}
