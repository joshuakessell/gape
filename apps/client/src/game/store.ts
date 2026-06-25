// Tiny external store for the HUD, read via React 19's useSyncExternalStore.
// The swallow system pushes score/tier here only when they actually change, so
// the per-frame game loop never triggers React re-renders.
type Listener = () => void;

export interface HudSnapshot {
  score: number;
  tier: number;
}

let snapshot: HudSnapshot = { score: 0, tier: 0 };
const listeners = new Set<Listener>();

export function getHud(): HudSnapshot {
  return snapshot;
}

export function subscribeHud(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setHud(score: number, tier: number): void {
  if (score === snapshot.score && tier === snapshot.tier) return;
  snapshot = { score, tier };
  for (const listener of listeners) listener();
}
