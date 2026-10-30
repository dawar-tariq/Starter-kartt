import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { createCameraFramer } from './framing';
import { BagBody, BagEmblem, BagHandles } from './ShoppingSculpture';
function ClosingSculpture({
  progress,
  reduced,
}: {
  progress: RefObject<number>;
  reduced: boolean;
}) {
  const bag = useRef<THREE.Group>(null),
    world = useRef<THREE.Group>(null);
  const frameCamera = useMemo(createCameraFramer, []);
  useFrame(({ clock, camera, gl }, delta) => {
    if (!bag.current || !world.current) return;
    const t = reduced ? 0 : clock.elapsedTime;
    bag.current.rotation.y = THREE.MathUtils.damp(
      bag.current.rotation.y,
      -0.24 + (reduced ? 0 : progress.current * 0.44),
      5,
      Math.min(delta, 0.08),
    );
    bag.current.rotation.z = -0.055 + Math.sin(t * 0.35) * 0.012;
    bag.current.position.y = -0.15 + Math.sin(t * 0.65) * 0.035;
    gl.domElement.dataset.modelFrame = frameCamera(
      world.current,
      camera as THREE.PerspectiveCamera,
      -0.06,
      0.1,
      0.87,
    );
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
      <group ref={world}>
        <group
          ref={bag}
          rotation={[0.025, -0.24, -0.055]}
          position={[0, -0.15, 0]}
        >
          <BagBody />
          <BagHandles />
          <BagEmblem />
        </group>
        <mesh position={[0, -2.1, 0]}>
          <cylinderGeometry args={[2.3, 2.4, 0.16, 80]} />
          <meshStandardMaterial
            color="#30213c"
            metalness={0.65}
            roughness={0.35}
          />
        </mesh>
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
