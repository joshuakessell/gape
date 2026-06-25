import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';

/** Authoritative state for one player's hole. */
export class HoleState extends Schema {
  @type('number') x = 0;
  @type('number') z = 0;
  @type('number') radius = 0;
  @type('uint32') score = 0;
  @type('uint8') tier = 0;
  /** Last input seq the server has processed — drives client reconciliation. */
  @type('uint32') ackSeq = 0;
}

/** Whole-match authoritative state. Props sync as one phase byte per uid; the
 *  client rebuilds prop positions deterministically from `seed`. */
export class MatchState extends Schema {
  @type('uint32') seed = 0;
  @type({ map: HoleState }) holes = new MapSchema<HoleState>();
  @type(['uint8']) props = new ArraySchema<number>();
}
