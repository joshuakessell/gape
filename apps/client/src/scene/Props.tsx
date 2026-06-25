import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { type InstancedMesh, Object3D } from 'three';
import type { PlacedProp, PropDef } from '@gape/shared';
import { MANIFEST } from '../content/manifest';
import { growth, propRuntime, propsByDef } from '../game/propsRuntime';
import { setHud } from '../game/store';
import { stepSwallow } from '../game/swallowSystem';
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

/** Runs the authoritative-ish local swallow step once per frame. */
function SwallowSystem(): null {
  useFrame((_, dt) => {
    if (stepSwallow(dt)) setHud(growth.state.score, growth.state.tier);
  });
  return null;
}

function Archetype({ def }: { def: PropDef }) {
  const ref = useRef<InstancedMesh>(null);
  const geom = useMemo(() => geometryFor(def), [def]);
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
      <SwallowSystem />
      {MANIFEST.props.map((def) => (
        <Archetype key={def.id} def={def} />
      ))}
    </>
  );
}
