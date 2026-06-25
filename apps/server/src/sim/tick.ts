import { type PropQuery, WORLD, applyEaten, clampDt, stepHole, stepProp } from '@gape/shared';
import type { Player } from './player.js';
import type { ServerWorld } from './world.js';

const CONFIG = { sinkTime: WORLD.sinkTime, toppleTime: WORLD.toppleTime };

function movePlayer(player: Player, dt: number): void {
  const input = { keyDir: player.input.dir, target: player.input.target };
  player.pos = stepHole(player.pos, input, { speed: WORLD.holeSpeed, dt, bounds: WORLD.bounds });
}

function swallowFor(world: ServerWorld, player: Player, dt: number): void {
  const hole = { center: player.pos, r: player.growth.radius };
  for (let uid = 0; uid < world.placed.length; uid++) {
    const motion = world.motion[uid]!;
    if (motion.phase === 'gone') continue;
    const placed = world.placed[uid]!;
    const def = world.defs.get(placed.defId)!;
    const prop: PropQuery = { center: placed.pos, footprintRadius: def.footprintRadius, topple: def.topple };
    const res = stepProp(motion, { hole, prop, dt, config: CONFIG });
    motion.phase = res.phase;
    motion.t = res.t;
    if (res.scored) player.growth = applyEaten(player.growth, def.points);
  }
}

/** Authoritative one-frame advance for a single player (input clamp + swallow). */
export function stepWorld(world: ServerWorld, player: Player, rawDt: number): void {
  const dt = clampDt(rawDt, WORLD.maxDt);
  movePlayer(player, dt);
  swallowFor(world, player, dt);
}
