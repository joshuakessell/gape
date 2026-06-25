/** A point/vector on the ground plane (xz; y is up and intentionally absent). */
export interface Vec2 {
  x: number;
  z: number;
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, z: a.z + b.z };
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, z: a.z - b.z };
}

export function scale(v: Vec2, s: number): Vec2 {
  return { x: v.x * s, z: v.z * s };
}

export function len(v: Vec2): number {
  return Math.hypot(v.x, v.z);
}

/** Planar (Euclidean) distance between two ground points. */
export function dist2(a: Vec2, b: Vec2): number {
  return len(sub(a, b));
}

export function normalize(v: Vec2): Vec2 {
  const l = len(v);
  return l === 0 ? { x: 0, z: 0 } : { x: v.x / l, z: v.z / l };
}
