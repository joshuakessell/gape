import { Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect } from 'react';
import { Hud } from './Hud';
import { connect } from './net/connection';
import { Scene } from './scene/Scene';

export function App() {
  useEffect(() => void connect(), []);
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
