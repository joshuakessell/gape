import { useHoleControls } from '../input/useHoleControls';
import { CameraRig } from './CameraRig';
import { Ground } from './Ground';
import { Hole } from './Hole';

// The ground shader and rim torus are unlit, so the scene needs no lights.
export function Scene() {
  const { onGroundPointerDown } = useHoleControls();
  return (
    <>
      <CameraRig />
      <Ground onPointerDown={onGroundPointerDown} />
      <Hole />
    </>
  );
}
