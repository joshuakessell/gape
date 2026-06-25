import { Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Hud } from './Hud';
import { Scene } from './scene/Scene';

export function App() {
  return (
    <>
      <Canvas dpr={[1, 1.5]} shadows={false} gl={{ antialias: true }}>
        <color attach="background" args={['#1a1f2b']} />
        <Scene />
        {import.meta.env.DEV && <Stats />}
      </Canvas>
      <Hud />
    </>
  );
}
