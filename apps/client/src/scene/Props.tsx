import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { type InstancedMesh, Object3D } from 'three';
import { MANIFEST, type PlacedProp, type PropDef } from '@gape/shared';
import { propRuntime, propsByDef } from '../game/propsRuntime';
import { geometryFor } from './propGeometry';
import { writeForPhase } from './propTransforms';

const scratch = new Object3D();

function writeInstances(mesh: InstancedMesh | null, list: PlacedProp[]): void {
  if (!mesh) return;
  for (let i = 0; i < list.length; i++) {
    const placed = list[i]!;
    writeForPhase(scratch, placed, propRuntime.get(placed.uid)!);
    scratch.updateMatrix();
    mesh.setMatrixAt(i, scratch.matrix);
  }
  mesh.count = list.length;
  mesh.instanceMatrix.needsUpdate = true;
}

function Archetype({ def }: { def: PropDef }) {
  const ref = useRef<InstancedMesh>(null);
  const geom = useMemo(() => geometryFor(def), [def]);
  useEffect(() => () => geom.dispose(), [geom]); // free GPU buffers on unmount/HMR
  const list = propsByDef.get(def.id) ?? [];
  useFrame(() => writeInstances(ref.current, list));
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, Math.max(1, def.maxInstances)]} frustumCulled={false}>
      <primitive object={geom} attach="geometry" />
      <meshLambertMaterial color={def.color} />
    </instancedMesh>
  );
}

export function Props() {
  return (
    <>
      {MANIFEST.props.map((def) => (
        <Archetype key={def.id} def={def} />
      ))}
    </>
  );
}
