import type { ThreeEvent } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { ShaderMaterial } from 'three';
import { WORLD } from '@gape/shared';
import { holeState } from '../holeState';
import { type HoleUniforms, holeFragmentShader, holeVertexShader, makeHoleUniforms } from './holeShader';

const SIZE = (Math.max(WORLD.bounds.halfW, WORLD.bounds.halfH) + 8) * 2;

interface GroundProps {
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
}

// Read uniforms straight off the material so updates reach the GPU regardless of
// how R3F applies the initial `uniforms` prop.
function syncUniforms(mat: ShaderMaterial | null): void {
  const u = mat?.uniforms as HoleUniforms | undefined;
  if (!u) return;
  u.uHoleCenter.value.set(holeState.pos.x, holeState.pos.z);
  u.uHoleRadius.value = holeState.radius;
}

export function Ground({ onPointerDown }: GroundProps) {
  const matRef = useRef<ShaderMaterial>(null);
  const initialUniforms = useMemo(makeHoleUniforms, []); // seeds the material once
  useFrame(() => syncUniforms(matRef.current));

  return (
    <mesh rotation-x={-Math.PI / 2} onPointerDown={onPointerDown}>
      <planeGeometry args={[SIZE, SIZE, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={holeVertexShader}
        fragmentShader={holeFragmentShader}
        uniforms={initialUniforms}
      />
    </mesh>
  );
}
