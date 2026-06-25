import { OrthographicCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3, type OrthographicCamera as ThreeOrthoCamera } from 'three';
import { holeState } from '../holeState';

// Fixed Diablo-style isometric offset; the camera lerp-follows the hole and
// looks at it every frame. Scratch vectors are module-level to avoid per-frame
// allocation (there is only ever one camera).
const OFFSET = new Vector3(18, 26, 18);
const FOLLOW = 6;
const focus = new Vector3();
const desired = new Vector3();

export function CameraRig() {
  const camRef = useRef<ThreeOrthoCamera>(null);

  useFrame((_, dt) => {
    const cam = camRef.current;
    if (!cam) return;
    focus.set(holeState.pos.x, 0, holeState.pos.z);
    desired.copy(focus).add(OFFSET);
    cam.position.lerp(desired, 1 - Math.exp(-FOLLOW * dt));
    cam.lookAt(focus);
  });

  return <OrthographicCamera ref={camRef} makeDefault position={[18, 26, 18]} zoom={22} near={0.1} far={200} />;
}
