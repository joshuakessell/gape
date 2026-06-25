# gape

Browser-based 3D multiplayer "hole eats the city" game (Hole.io × Katamari,
Diablo-style fixed iso camera). pnpm + turbo monorepo.

## Phase 0 — "Hello-hole on a plane"

Render + input core only: a fixed orthographic camera, a low-poly ground plane,
and a single **shader-cutout** hole that slides flat (y locked) under WASD/arrows
+ tap-to-move, clamped to the play-area edges, at ~60fps. The load-bearing
movement/containment math lives in `@gape/shared`, built TDD-first. The server is
a compile-only Colyseus stub — no networking yet.

## Layout

```
apps/
  client/   Vite + React Three Fiber scene  (→ Vercel later)
  server/   Colyseus 0.17 stub              (→ Fly.io later; compile-only in P0)
packages/
  shared/   pure, TDD'd logic shared client+server  ⭐
  content/  asset-manifest placeholder (lands P1)
  tooling/  placeholder
  e2e/      placeholder
```

## Requirements

- Node ≥ 22 · pnpm 10.27

## Commands

```bash
pnpm install                          # resolve the workspace
pnpm --filter @gape/shared test       # unit tests (TDD core)
pnpm --filter @gape/shared test:coverage
pnpm build                            # turbo: shared → client/server
pnpm typecheck
pnpm lint
pnpm dev:client                       # Vite dev server (LAN URL printed for phone testing)
pnpm dev:server                       # Colyseus stub
```

### Try Phase 0

`pnpm dev:client`, open the printed URL. Drive the hole with **WASD / arrow keys**
or **tap/click** the ground. The hole clamps at the play-area edges and the camera
tracks it. The drei `<Stats>` overlay shows the frame rate. To check 60fps on a
real phone, open the LAN URL Vite prints (`server.host` is enabled).

## Roadmap (later phases)

P1 assets · P2 Colyseus authoritative tick + state sync · P3 lobby/matchmaking ·
P4 PvP/growth · P6 Rapier physics · P7 powerups.
