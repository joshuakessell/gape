import type { Room } from 'colyseus.js';

/** What the client reads off the authoritative hole (subset of server HoleState). */
export interface HoleView {
  x: number;
  z: number;
  radius: number;
  score: number;
  tier: number;
  ackSeq: number;
}

interface MatchView {
  holes: { get(id: string): HoleView | undefined };
  props: ArrayLike<number>;
  seed: number;
}

// colyseus.js leaves room.state undefined until the first patch decodes.
function view(room: Room): MatchView | null {
  const state = room.state as MatchView | undefined;
  return state?.holes ? state : null;
}

/** The local player's authoritative hole, or null until the first patch lands. */
export function myHole(room: Room): HoleView | null {
  const state = view(room);
  return state ? (state.holes.get(room.sessionId) ?? null) : null;
}

/** Authoritative prop phase codes (uid-indexed), or null until the first patch. */
export function propCodes(room: Room): ArrayLike<number> | null {
  return view(room)?.props ?? null;
}
