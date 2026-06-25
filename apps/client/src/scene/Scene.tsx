import { useHoleControls } from '../input/useHoleControls';
import { ServerSync } from '../net/ServerSync';
import { CameraRig } from './CameraRig';
import { Ground } from './Ground';
import { Hole } from './Hole';
import { Props } from './Props';

// Props use Lambert shading, so the scene now has a hemisphere fill + key light.
// (The ground shader and rim torus stay unlit and ignore these.)
export function Scene() {
  const { onGroundPointerDown } = useHoleControls();
  return (
    <>
      <ServerSync />
      <hemisphereLight args={['#cfe0ff', '#3a3a3a', 0.6]} />
      <directionalLight position={[12, 18, 6]} intensity={1.5} />
      <CameraRig />
      <Ground onPointerDown={onGroundPointerDown} />
      <Props />
      <Hole />
    </>
  );
}
