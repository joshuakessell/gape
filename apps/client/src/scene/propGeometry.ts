import { BoxGeometry, type BufferGeometry, ConeGeometry, CylinderGeometry } from 'three';
import type { PropDef } from '@gape/shared';

/** Primitive geometry with its base at y=0 and footprint ≈ def.footprintRadius. */
export function geometryFor(def: PropDef): BufferGeometry {
  const r = def.footprintRadius;
  const h = def.height;
  if (def.shape === 'box') return new BoxGeometry(r * 2, h, r * 2).translate(0, h / 2, 0);
  if (def.shape === 'cone') return new ConeGeometry(r, h, 10).translate(0, h / 2, 0);
  return new CylinderGeometry(r, r, h, 14).translate(0, h / 2, 0);
}
