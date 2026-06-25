import { MANIFEST, type Disc, type PlacedProp, type PropMotion, applyEaten, stepProp } from '@gape/shared';
import { holeState } from '../holeState';
import { growth, placedProps, propRuntime } from './propsRuntime';

const CONFIG = { sinkTime: 0.5, toppleTime: 0.4 };
const DEFS = new Map(MANIFEST.props.map((d) => [d.id, d]));

interface StepCtx {
  dt: number;
  hole: Disc;
}

function applyScore(points: number): void {
  growth.state = applyEaten(growth.state, points);
  holeState.radius = growth.state.radius;
}

function advanceProp(placed: PlacedProp, motion: PropMotion, ctx: StepCtx): boolean {
  const def = DEFS.get(placed.defId)!;
  const prop = { center: placed.pos, footprintRadius: def.footprintRadius, topple: def.topple };
  const res = stepProp(motion, { hole: ctx.hole, prop, dt: ctx.dt, config: CONFIG });
  motion.phase = res.phase;
  motion.t = res.t;
  if (res.scored) applyScore(def.points);
  return res.scored;
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
