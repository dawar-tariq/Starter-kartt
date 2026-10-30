import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  Lightformer,
  RoundedBox,
  useTexture,
} from '@react-three/drei';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { createCameraFramer } from './framing';
import { BagBody, BagEmblem, BagHandles } from './ShoppingSculpture';
import {
  StudioArchitecture,
  Platform,
  Garment,
  MaterialSwatch,
  CommerceConnections,
  routes,
} from './WorldParts';
import { mix, range, type JourneyState } from './journey';
type SceneProps = {
  state: RefObject<JourneyState>;
  onReady: () => void;
  onFailure: () => void;
};
function World({ state, onReady }: Pick<SceneProps, 'state' | 'onReady'>) {
  const world = useRef<THREE.Group>(null),
    assembly = useRef<THREE.Group>(null),
    handles = useRef<THREE.Group>(null),
    emblem = useRef<THREE.Group>(null),
    shell = useRef<THREE.Group>(null),
    screen = useRef<THREE.Group>(null),
    leftWing = useRef<THREE.Group>(null),
    rightWing = useRef<THREE.Group>(null),
    swatches = useRef<THREE.Group>(null),
    architecture = useRef<THREE.Group>(null),
    connections = useRef<THREE.Group>(null),
    product = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null),
    rimLight = useRef<THREE.PointLight>(null);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const interaction = useRef(new THREE.Vector2());
  const progress = useRef(0),
    ambientTime = useRef(0);
  const [mainMap, sideMap] = useTexture([
    '/images/offscript.svg',
    '/images/form-field.svg',
  ]);
  mainMap.colorSpace = sideMap.colorSpace = THREE.SRGBColorSpace;
  const readyCallback = useRef(onReady);
  readyCallback.current = onReady;
  useEffect(() => {
    readyCallback.current();
  }, []);
  const frameCamera = useMemo(createCameraFramer, []);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'mouse')
        pointer.current = {
          x: (e.clientX / innerWidth - 0.5) * 2,
          y: (e.clientY / innerHeight - 0.5) * 2,
        };
    };
    const reset = () => {
      pointer.current = { x: 0, y: 0 };
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', reset);
    };
  }, []);
  useFrame(({ camera, size, gl, invalidate }, delta) => {
    if (!world.current || !assembly.current || !state.current) return;
    const { reduced, paused } = state.current;
    const response = 1 - Math.exp(-5 * Math.min(delta, 0.05));
    interaction.current.x +=
      (pointer.current.x - interaction.current.x) * response;
    interaction.current.y +=
      (pointer.current.y - interaction.current.y) * response;
    const mobile = size.width < 640;
    const perspective = camera as THREE.PerspectiveCamera;
    if (perspective.fov !== 38) {
      perspective.fov = 38;
      perspective.updateProjectionMatrix();
    }
    progress.current = reduced
      ? 0
      : THREE.MathUtils.damp(
          progress.current,
          state.current.progress,
          7,
          Math.min(delta, 0.08),
        );
    const p = progress.current;
    if (paused && !reduced && Math.abs(p - state.current.progress) > 0.001)
      invalidate();
    if (!paused && !reduced) ambientTime.current += Math.min(delta, 0.05);
    const t = ambientTime.current,
      idle = reduced ? 0 : 1;
    const brand = range(p, 0.12, 0.24) * (1 - range(p, 0.28, 0.4));
    const unfold = range(p, 0.29, 0.47),
      commerce = range(p, 0.55, 0.67),
      launch = range(p, 0.79, 0.96);
    const travel = range(p, 0.05, 0.27),
      fly = range(p, 0.33, 0.51);
    // The canvas has its own layout cell; the object no longer needs viewport offsets.
    world.current.position.set(0, 0, 0);
    world.current.scale.setScalar(1);
    assembly.current.position.y =
      Math.sin(t * 0.65) * 0.065 * idle + mix(0.15, 0.3, launch);
    assembly.current.rotation.set(
      0.04 + interaction.current.y * 0.015 * idle,
      mix(-0.28, 0.02, unfold) +
        brand * 0.42 +
        Math.sin(t * 0.2) * 0.025 * idle +
        interaction.current.x * 0.025 * idle,
      mix(-0.09, 0, unfold),
    );
    shell.current!.scale.set(
      mix(1, 1.37, unfold),
      mix(1, 0.91, unfold),
      mix(1, 0.25, unfold),
    );
    handles.current!.scale.y = Math.max(0.001, 1 - unfold);
    handles.current!.position.y = brand * 0.22 - unfold * 0.2;
    handles.current!.rotation.z = brand * -0.12;
    emblem.current!.scale.setScalar(Math.max(0.001, 1 - range(p, 0.29, 0.36)));
    screen.current!.visible = unfold > 0.01;
    screen.current!.scale.setScalar(Math.max(0.001, unfold));
    leftWing.current!.visible = unfold > 0.02;
    leftWing.current!.scale.setScalar(
      Math.max(0.001, unfold * (1 - commerce * 0.13)),
    );
    leftWing.current!.position.set(
      mix(-0.3, -2.5, unfold),
      0.17 + commerce * 0.35,
      mix(-0.8, -0.2, unfold),
    );
    leftWing.current!.rotation.y = mix(1.4, 0.3, unfold) + launch * 0.14;
    rightWing.current!.visible = unfold > 0.02 && !mobile;
    rightWing.current!.scale.setScalar(Math.max(0.001, unfold));
    rightWing.current!.position.set(mix(0.3, 2.65, unfold), 0.08, -0.5);
    rightWing.current!.rotation.y = mix(-1.4, -0.33, unfold);
    swatches.current!.visible = brand > 0.005;
    swatches.current!.scale.setScalar(Math.max(0.001, brand));
    swatches.current!.rotation.y = -0.12 + brand * 0.15;
    architecture.current!.rotation.y =
      mix(-0.12, 0.14, travel) + launch * -0.26;
    architecture.current!.position.z = mix(-1.2, -2.3, unfold);
    architecture.current!.scale.setScalar(mix(1, 1.07, launch));
    connections.current!.visible = commerce > 0.005;
    connections.current!.scale.setScalar(
      Math.max(0.001, commerce * (1 - launch * 0.12)),
    );
    connections.current!.position.y = Math.sin(t * 0.45) * 0.035 * idle;
    product.current!.visible = unfold > 0.02 && !mobile;
    product.current!.scale.setScalar(Math.max(0.001, unfold * 0.66));
    product.current!.position.set(
      -2.35,
      -0.2 + Math.sin(t * 0.5) * 0.09 * idle,
      1.05,
    );
    product.current!.rotation.y = Math.sin(t * 0.2) * 0.12;
    packets.current.forEach((packet, index) => {
      if (packet) {
        const point = routes[index].getPoint((t * 0.12 + index / 3) % 1);
        packet.position.copy(point);
      }
    });
    keyLight.current!.intensity = mix(3.2, 4.5, unfold);
    rimLight.current!.intensity = mix(12, 20, commerce);
    const yaw =
      mix(-0.13, 0.2, travel) - fly * 0.31 + commerce * 0.1 - launch * 0.16;
    const pitch = 0.09 + travel * 0.055 - fly * 0.035 + launch * 0.045;
    // Frame every visible part, including unfolded panels, for THIS canvas aspect ratio.
    // Padding remains generous even during the camera dolly and pointer response.
    const envelope = frameCamera(
      world.current,
      perspective,
      yaw + interaction.current.x * 0.012 * idle,
      pitch,
      mix(0.86, 0.91, Math.sin(range(p, 0.28, 0.47) * Math.PI)),
    );
    gl.domElement.dataset.modelFrame = envelope;
    // Exposed diagnostics make camera/scroll regression tests deterministic without React rerenders.
    gl.domElement.dataset.sceneProgress = p.toFixed(3);
    gl.domElement.dataset.camera = camera.position
      .toArray()
      .map((v) => v.toFixed(2))
      .join(',');
  });
  return (
    <>
      <ambientLight intensity={0.8} color="#c8b3de" />
      <directionalLight
        ref={keyLight}
        position={[-3, 7, 6]}
        intensity={3.2}
        color="#ead5ef"
      />
      <directionalLight position={[6, 3, -4]} intensity={3.2} color="#a98ddb" />
      <pointLight
        ref={rimLight}
        position={[1.8, 2, -2]}
        intensity={12}
        distance={15}
        color="#e0b1cb"
        decay={2}
      />
      <Environment resolution={innerWidth < 901 ? 64 : 128}>
        <Lightformer
          intensity={0.7}
          position={[0, 2, 6]}
          scale={[5, 5, 1]}
          color="#e4cbe6"
        />
        <Lightformer
          intensity={3.8}
          position={[-4, 3, 4]}
          rotation={[0, 0.7, 0]}
          scale={[2, 8, 1]}
        />
        <Lightformer
          intensity={3}
          position={[4, 2, 2]}
          rotation={[0, -0.7, 0]}
          scale={[1, 6, 1]}
          color="#e0b1cb"
        />
        <Lightformer
          intensity={2}
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[6, 3, 1]}
        />
      </Environment>
      <group ref={world} position={[0, 0, 0]}>
        <Platform />
        <group ref={architecture} position={[0, 0, -1.2]}>
          <StudioArchitecture />
        </group>
        <group ref={assembly}>
          <group ref={shell}>
            <BagBody />
          </group>
          <group ref={handles}>
            <BagHandles />
          </group>
          <group ref={emblem}>
            <BagEmblem />
          </group>
          <group ref={screen} visible={false} position={[0, 0, 0.14]}>
            <mesh>
              <planeGeometry args={[3.62, 2.34]} />
              <meshBasicMaterial map={mainMap} toneMapped={false} />
            </mesh>
          </group>
          <group ref={leftWing} visible={false}>
            <RoundedBox args={[1.22, 2.35, 0.09]} radius={0.08} smoothness={3}>
              <meshStandardMaterial
                color="#bca1c6"
                metalness={0.85}
                roughness={0.25}
              />
            </RoundedBox>
            <mesh position={[0, 0, 0.055]}>
              <planeGeometry args={[1.08, 2.14]} />
              <meshBasicMaterial map={sideMap} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0.99, 0.063]}>
              <planeGeometry args={[0.26, 0.045]} />
              <meshBasicMaterial color="#231942" />
            </mesh>
          </group>
          <group ref={rightWing} visible={false}>
            <RoundedBox args={[1.95, 2.18, 0.08]} radius={0.045} smoothness={3}>
              <meshStandardMaterial
                color="#bca1c6"
                metalness={0.8}
                roughness={0.3}
              />
            </RoundedBox>
            <mesh position={[0, 0, 0.05]}>
              <planeGeometry args={[1.83, 2.06]} />
              <meshBasicMaterial map={sideMap} toneMapped={false} />
            </mesh>
          </group>
        </group>
        <group ref={swatches} visible={false}>
          <group position={[-2, 1, 0.6]} rotation={[0.1, 0.4, -0.18]}>
            <MaterialSwatch color="#e0b1cb" />
          </group>
          <group position={[2, 0.3, 0.3]} rotation={[0.1, -0.4, 0.2]}>
            <MaterialSwatch color="#f7f4fa" />
          </group>
          <group position={[0.8, -1.1, 1.7]} rotation={[0.4, 0.1, -0.4]}>
            <MaterialSwatch color="#231942" />
          </group>
        </group>
        <group ref={connections} visible={false}>
          <CommerceConnections />
          {routes.map((_, i) => (
            <mesh
              ref={(node) => {
                packets.current[i] = node;
              }}
              key={i}
            >
              <sphereGeometry args={[0.055, 10, 8]} />
              <meshBasicMaterial color="#f1d1e4" />
            </mesh>
          ))}
        </group>
        <group ref={product} visible={false}>
          <Garment />
        </group>
        <mesh
          position={[0, -1.64, 0.3]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1, 0.65, 1]}
        >
          <circleGeometry args={[1.65, 48]} />
          <meshBasicMaterial
            color="#09070d"
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
      </group>
    </>
  );
}
export default function CommerceScene({
  state,
  onReady,
  onFailure,
}: SceneProps) {
  const [visible, setVisible] = useState(true),
    [lost, setLost] = useState(false);
  const host = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement | null>(null);
  const callbacks = useRef({ onReady, onFailure });
  callbacks.current = { onReady, onFailure };
  const [supported] = useState(() => {
    try {
      const test = document.createElement('canvas');
      const context = test.getContext('webgl2');
      if (context) context.getExtension('WEBGL_lose_context')?.loseContext();
      return !!context;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    if (!supported) callbacks.current.onFailure();
  }, [supported]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const handleLoss = useMemo(
    () => (event: Event) => {
      event.preventDefault();
      setLost(true);
      callbacks.current.onFailure();
    },
    [],
  );
  useEffect(
    () => () =>
      canvas.current?.removeEventListener('webglcontextlost', handleLoss),
    [handleLoss],
  );
  if (!supported || lost) return null;
  return (
    <div ref={host} className="commerce-canvas">
      <Canvas
        dpr={innerWidth < 901 ? 1 : [1, 1.4]}
        camera={{ fov: 38, position: [0, 1, 15] }}
        frameloop={
          !visible || state.current?.reduced || state.current?.paused
            ? 'demand'
            : 'always'
        }
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        onCreated={({ gl, invalidate }) => {
          state.current.invalidate = invalidate;
          canvas.current = gl.domElement;
          gl.domElement.addEventListener('webglcontextlost', handleLoss);
        }}
      >
        <World state={state} onReady={onReady} />
      </Canvas>
    </div>
  );
}
