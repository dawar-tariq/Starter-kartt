import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { BagBody, BagEmblem, BagHandles } from './ShoppingSculpture';
function ClosingSculpture({
  progress,
  reduced,
}: {
  progress: RefObject<number>;
  reduced: boolean;
}) {
  const bag = useRef<THREE.Group>(null),
    orbit = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!bag.current || !orbit.current) return;
    const t = reduced ? 0 : clock.elapsedTime;
    bag.current.rotation.y = THREE.MathUtils.damp(
      bag.current.rotation.y,
      -0.4 + (reduced ? 0 : progress.current * 1.1),
      5,
      delta,
    );
    bag.current.rotation.z = -0.12 + Math.sin(t * 0.35) * 0.025;
    bag.current.position.y = -0.45 + Math.sin(t * 0.7) * 0.06;
    orbit.current.rotation.y = reduced ? -0.2 : t * 0.045;
    orbit.current.rotation.z = -0.4 + (reduced ? 0 : progress.current * 0.4);
  });
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 5]} intensity={4} color="#e3bbdb" />
      <directionalLight position={[-4, 3, -2]} intensity={4} color="#9e80d2" />
      <Environment resolution={64}>
        <Lightformer
          position={[-4, 2, 4]}
          rotation={[0, 0.7, 0]}
          scale={[2, 8, 1]}
          intensity={3}
        />
        <Lightformer
          position={[4, 1, 3]}
          rotation={[0, -0.7, 0]}
          scale={[2, 6, 1]}
          intensity={3}
          color="#e0b1cb"
        />
      </Environment>
      <group ref={bag} rotation={[0.05, -0.4, -0.12]} position={[0, -0.45, 0]}>
        <BagBody />
        <BagHandles />
        <BagEmblem />
      </group>
      <group ref={orbit} position={[0, 0.1, -0.4]} rotation={[0.5, -0.2, -0.4]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0.35 * i, 0.6 * i, 0.2 * i]}>
            <torusGeometry
              args={[2.55 + i * 0.16, 0.025 - i * 0.005, 6, 100]}
            />
            <meshStandardMaterial
              color={i === 0 ? '#d7b2ce' : '#715781'}
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}
export default function FinaleScene({
  visible,
  reduced,
  progress,
  onReady,
  onFailure,
}: {
  visible: boolean;
  reduced: boolean;
  progress: RefObject<number>;
  onReady: () => void;
  onFailure: () => void;
}) {
  const [lost, setLost] = useState(false);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const failure = useRef(onFailure);
  failure.current = onFailure;
  const handleLoss = useMemo(
    () => (event: Event) => {
      event.preventDefault();
      setLost(true);
      failure.current();
    },
    [],
  );
  useEffect(
    () => () =>
      canvas.current?.removeEventListener('webglcontextlost', handleLoss),
    [handleLoss],
  );
  if (lost) return null;
  return (
    <Canvas
      dpr={innerWidth < 700 ? 1 : [1, 1.3]}
      frameloop={visible && !reduced ? 'always' : 'demand'}
      camera={{ position: [0, 0.6, 8.5], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => {
        canvas.current = gl.domElement;
        gl.domElement.addEventListener('webglcontextlost', handleLoss);
        onReady();
      }}
    >
      <ClosingSculpture progress={progress} reduced={reduced} />
    </Canvas>
  );
}
