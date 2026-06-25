// Tiny external store for the HUD, read via React 19's useSyncExternalStore.
// ServerSync pushes score/tier (and connection status) here only when they
// actually change, so the per-frame game loop never triggers React re-renders.
type Listener = () => void;

export interface HudSnapshot {
  score: number;
  tier: number;
  connected: boolean;
}

let snapshot: HudSnapshot = { score: 0, tier: 0, connected: false };
const listeners = new Set<Listener>();

export function getHud(): HudSnapshot {
  return snapshot;
}

export function subscribeHud(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit(): void {
  for (const listener of listeners) listener();
}

export function setHud(score: number, tier: number): void {
  if (score === snapshot.score && tier === snapshot.tier) return;
  snapshot = { ...snapshot, score, tier };
  emit();
}

export function setConnected(connected: boolean): void {
  if (connected === snapshot.connected) return;
  snapshot = { ...snapshot, connected };
  emit();
}
