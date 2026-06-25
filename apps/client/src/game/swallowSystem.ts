import { type Disc, type PlacedProp, applyEaten, classifySwallow } from '@gape/shared';
import { MANIFEST } from '../content/manifest';
import { holeState } from '../holeState';
import { type PropRuntime, growth, placedProps, propRuntime } from './propsRuntime';

const SINK_TIME = 0.5;
const TOPPLE_TIME = 0.4;
const DEFS = new Map(MANIFEST.props.map((d) => [d.id, d]));

interface StepCtx {
  dt: number;
  hole: Disc;
}

function classifyIdle(placed: PlacedProp, rt: PropRuntime, hole: Disc): boolean {
  const def = DEFS.get(placed.defId)!;
  const verdict = classifySwallow(hole, { center: placed.pos, footprintRadius: def.footprintRadius, topple: def.topple });
  if (verdict === 'swallow') rt.phase = 'sinking';
  else if (verdict === 'topple') rt.phase = 'toppling';
  return false;
}

function advanceSinking(placed: PlacedProp, rt: PropRuntime, dt: number): boolean {
  rt.t += dt / SINK_TIME;
  if (rt.t < 1) return false;
  rt.phase = 'gone';
  growth.state = applyEaten(growth.state, DEFS.get(placed.defId)!.points);
  holeState.radius = growth.state.radius;
  return true;
}

function advanceToppling(rt: PropRuntime, dt: number): void {
  rt.t += dt / TOPPLE_TIME;
  if (rt.t >= 1) {
    rt.t = 1;
    rt.phase = 'settled';
  }
}

function advanceProp(placed: PlacedProp, rt: PropRuntime, ctx: StepCtx): boolean {
  if (rt.phase === 'idle') return classifyIdle(placed, rt, ctx.hole);
  if (rt.phase === 'sinking') return advanceSinking(placed, rt, ctx.dt);
  if (rt.phase === 'toppling') advanceToppling(rt, ctx.dt);
  return false;
}

/** Advance every prop one frame; returns true when a swallow changed growth. */
export function stepSwallow(dt: number): boolean {
  const ctx: StepCtx = { dt, hole: { center: holeState.pos, r: holeState.radius } };
  let grew = false;
  for (const placed of placedProps) {
    if (advanceProp(placed, propRuntime.get(placed.uid)!, ctx)) grew = true;
  }
  return grew;
}
