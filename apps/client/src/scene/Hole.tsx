import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';
import { holeState } from '../holeState';

// A thin torus "rim lip" that rides the hole, sitting just above the ground to
// read as a raised edge. Scaled by the hole radius each frame.
export function Hole() {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const r = holeState.radius;
    mesh.position.set(holeState.pos.x, 0.02, holeState.pos.z);
    mesh.scale.set(r, r, r);
  });

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2}>
      <torusGeometry args={[1, 0.06, 12, 48]} />
      <meshBasicMaterial color="#0a0d12" />
    </mesh>
  );
}
