# Gape — Phase 0: "Hello-hole on a plane"

## Context
Greenfield build of a browser-based 3D multiplayer "hole eats the city" game (Hole.io × Katamari, Diablo-style fixed camera). The full stack was chosen via a multi-agent design workflow (judged + adversarially reviewed). **Phase 0** is the first roadmap milestone: prove the render + input core on real hardware *before* any game logic, and stand up the monorepo skeleton so later phases (authoritative server, lobby, PvP, powerups) bolt on without re-architecting.

**Phase 0 goal:** a fixed iso-camera R3F scene with a low-poly ground plane and a single shader-cutout hole that slides flat (z/y locked), driven by WASD/arrows + tap-to-move, clamped to the play-area edges — running at 60fps, with the load-bearing movement/containment math built TDD-first in a shared package.

**Out of scope for Phase 0** (later phases): Colyseus tick loop & state sync (P2), lobby/matchmaking (P3), PvP/growth (P4), Rapier physics (P6), powerups (P7). The server here is a compile-only stub.

## Pinned versions (ground-truth latest, verified via npm 2026-06-25)
Newer than the design draft assumed — using real current majors:
- node 22 / pnpm 10.27 · TypeScript 6.0 · turbo 2.10
- **React 19.2** + **@react-three/fiber 9.6** + **@react-three/drei 10.7** + **three 0.184**
- Vite 8.1 · @vitejs/plugin-react 6.0 · Vitest 4.1 (+ @vitest/coverage-v8)
- colyseus 0.17.10 (server stub only) · zustand 5.0 · eslint 9 + typescript-eslint 8

## Monorepo layout (pnpm + turbo)
```
gape/
├── package.json ✅ created        pnpm-workspace.yaml ✅ created
├── turbo.json  tsconfig.base.json  eslint.config.js  .gitignore  .env.example  .npmrc  README.md
├── apps/
│   ├── client/   # Vite + R3F  → Vercel later
│   └── server/   # Colyseus 0.17 stub → Fly.io later (compile-only in P0)
└── packages/
    ├── shared/   # ⭐ pure, TDD'd logic shared client+server
    ├── content/  # README placeholder (asset manifest lands P1)
    └── (tooling/, e2e/ → README placeholders)
```

## Build approach — RED → GREEN → VALIDATE (per global TDD rule)

### 1. `packages/shared` (the load-bearing logic — TDD first)
Pure, renderer-free, Node-testable. **Write tests + throwing stubs → run vitest (RED) → implement (GREEN).**
- `vec2.ts` — `Vec2{x,z}`, `dist2`, `sub`, `len`, `normalize`, `scale`
- `footprint.ts` — `fitsInHole(hole,obj)` = `dist(centers)+obj.r ≤ hole.r` (the swallow rule); `containment()` 0..1
- `movement.ts` — `clampToBounds`, `desiredDir` (keyboard wins over tap-seek), `stepHole(pos,input,ctx)` pure integrate+clamp
- `tiers.ts` — `TIERS` table, `tierAt`, `isMaxTier`, `advanceTier`
- `controls.ts` — `keysToDir(pressed)` (WASD/arrows → ground dir, up = −z), `isMoveKey`
- `index.ts` re-exports. Tests in `src/__tests__/*.test.ts`. Built to `dist/` (consumed by client/server as `@gape/shared` workspace dep).

### 2. `apps/client` (R3F scene — verified by build + dev smoke)
Key rule baked in: **per-frame state mutates refs inside `useFrame`, never React `setState`** (the #1 R3F perf cliff).
- `holeState.ts` — mutable singleton `{pos, pressed:Set, target}` (glue state, not React state)
- `scene/CameraRig.tsx` — drei `<OrthographicCamera makeDefault>`, fixed Diablo offset, lerp-follows hole, `lookAt` each frame
- `scene/holeShader.ts` + `Ground.tsx` — large XZ plane with a **shader cutout** hole (radial dark interior + rim band + faint grid), `uHoleCenter` uniform updated per frame. **Not** CSG/boolean geometry.
- `scene/Hole.tsx` — thin torus "rim lip" mesh following the hole
- `input/useHoleControls.ts` — keyboard listeners + pointer raycast-to-ground (tap-to-move) + the per-frame `stepHole` integrate (keyboard cancels tap target); `clampDt` guards tab-refocus jumps
- `App.tsx` — `<Canvas dpr={[1,1.5]} shadows={false}>` + `<AdaptiveDpr>` + drei `<Stats>` (fps readout) + `<Scene>` + `<Hud>`
- `Hud.tsx`/`styles.css` — controls hint; `touch-action:none` for clean mobile tap. Vite `server.host:true` so a real phone on LAN can load it (directly serves the "validate 60fps on real Android" deliverable).

### 3. `apps/server` (compile-only stub)
- `index.ts` — boots `colyseus` `Server`, `define('match', MatchRoom)`, listens on `PORT`
- `rooms/MatchRoom.ts` — `Room` with onCreate/onJoin/onLeave logs + comment marking P2 wiring. No schema/tick yet.

## Quality gates (enforced while writing)
≤20 lines/fn · ≤3 params/fn · ≤2 nesting levels · ≤200 lines/file · ≤10 fns/file · ≥80% coverage (shared). Functions kept small; multi-arg calls packed into a `ctx` object to respect the 3-param limit.

## Verification (end-to-end)
1. `pnpm install` (root, workspaces resolve)
2. `pnpm --filter @gape/shared test` → **RED** first (stubs throw), then **GREEN** after implementing
3. `pnpm --filter @gape/shared test:coverage` → ≥80%
4. `pnpm build` (turbo: shared → client/server) and `pnpm typecheck` clean
5. `pnpm lint` clean (or only minor warnings)
6. `pnpm dev:client` → open browser: ground renders, hole follows WASD/arrows + tap, clamps at edges, camera tracks, `<Stats>` shows ~60fps. (Real-device check is the user's manual step — LAN URL provided.)
7. **Then:** launch an adversarial review Workflow over the built Phase 0 code (dimensions: R3F/Three perf anti-patterns, shader correctness, input/clamp/determinism edge cases, quality-gate compliance, security, monorepo/build config) → apply verified fixes → commit.

## Notes / decisions already made
- Using current React 19 / Vite 8 (not the draft's React 18 / Vite 5) — they're the real installed latest.
- `@gape/shared` is built to `dist` and consumed as a workspace dep (robust across vite + tsx); turbo orders `^build` before client/server.
- Server is intentionally a stub — Phase 0 is render+input only; no networking yet.
