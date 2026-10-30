import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function StudioArchitecture() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-2.35, -1.6);
    shape.lineTo(-2.35, 0.9);
    shape.bezierCurveTo(-2.35, 3.75, 2.35, 3.75, 2.35, 0.9);
    shape.lineTo(2.35, -1.6);
    shape.lineTo(2.08, -1.6);
    shape.lineTo(2.08, 0.9);
    shape.bezierCurveTo(2.08, 3.33, -2.08, 3.33, -2.08, 0.9);
    shape.lineTo(-2.08, -1.6);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.34,
      bevelEnabled: true,
      bevelSize: 0.055,
      bevelThickness: 0.055,
      bevelSegments: 3,
      steps: 1,
      curveSegments: 48,
    });
    geo.computeVertexNormals();
    return geo;
  }, []);
  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#a48cb7"
          metalness={0.92}
          roughness={0.21}
        />
      </mesh>
      <mesh
        geometry={geometry}
        position={[0, 0.05, -0.7]}
        scale={[1.16, 1.1, 0.7]}
      >
        <meshStandardMaterial
          color="#4d3b66"
          metalness={0.8}
          roughness={0.36}
        />
      </mesh>
      <mesh
        geometry={geometry}
        position={[0, 0.12, -1.6]}
        scale={[1.35, 1.22, 0.6]}
      >
        <meshStandardMaterial color="#2b203a" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}
export function Platform() {
  return (
    <group position={[0, -1.8, 0]}>
      <mesh position={[0, -0.12, -0.4]}>
        <cylinderGeometry args={[3.65, 3.9, 0.24, 96]} />
        <meshStandardMaterial
          color="#21162d"
          metalness={0.72}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.01, -0.4]}>
        <cylinderGeometry args={[3.15, 3.3, 0.09, 96]} />
        <meshStandardMaterial
          color="#382740"
          metalness={0.75}
          roughness={0.26}
        />
      </mesh>
      <mesh position={[0, 0.08, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.85, 2.86, 128]} />
        <meshBasicMaterial
          color="#be9acb"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.27, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.1, 4.11, 128]} />
        <meshBasicMaterial
          color="#806887"
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
export function Garment() {
  const geometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.24, 0.8);
    s.lineTo(-0.6, 0.68);
    s.lineTo(-1.0, 0.05);
    s.lineTo(-0.63, -0.16);
    s.lineTo(-0.43, 0.15);
    s.lineTo(-0.48, -0.92);
    s.quadraticCurveTo(0, -1.02, 0.48, -0.92);
    s.lineTo(0.43, 0.15);
    s.lineTo(0.63, -0.16);
    s.lineTo(1, 0.05);
    s.lineTo(0.6, 0.68);
    s.lineTo(0.24, 0.8);
    s.quadraticCurveTo(0, 0.53, -0.24, 0.8);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.035,
      bevelSegments: 3,
      curveSegments: 12,
    });
    return g;
  }, []);
  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#e3d9ce" roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.1, 0.12]}>
        <planeGeometry args={[0.3, 0.022]} />
        <meshStandardMaterial color="#8e7e91" />
      </mesh>
      <mesh position={[0, -0.02, 0.12]}>
        <planeGeometry args={[0.18, 0.012]} />
        <meshStandardMaterial color="#8e7e91" />
      </mesh>
    </group>
  );
}
export function MaterialSwatch({ color }: { color: string }) {
  return (
    <RoundedBox args={[0.85, 1.14, 0.12]} radius={0.055} smoothness={3}>
      <meshStandardMaterial color={color} metalness={0.65} roughness={0.25} />
    </RoundedBox>
  );
}
export function LabelCard({
  label,
  sublabel,
  symbol,
}: {
  label: string;
  sublabel: string;
  symbol: 'payment' | 'shipping' | 'chat';
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 280;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#22182f';
    ctx.fillRect(0, 0, 512, 280);
    ctx.strokeStyle = '#806b91';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 510, 278);
    ctx.strokeStyle = '#dfb8d5';
    ctx.lineWidth = 4;
    if (symbol === 'payment') {
      ctx.strokeRect(36, 35, 74, 48);
      ctx.fillStyle = '#dfb8d5';
      ctx.fillRect(36, 48, 74, 9);
    }
    if (symbol === 'shipping') {
      ctx.strokeRect(36, 35, 64, 50);
      ctx.beginPath();
      ctx.moveTo(36, 35);
      ctx.lineTo(67, 54);
      ctx.lineTo(100, 35);
      ctx.moveTo(67, 54);
      ctx.lineTo(67, 85);
      ctx.stroke();
    }
    if (symbol === 'chat') {
      ctx.strokeRect(36, 35, 70, 47);
      ctx.beginPath();
      ctx.moveTo(47, 82);
      ctx.lineTo(47, 95);
      ctx.lineTo(62, 82);
      ctx.stroke();
    }
    ctx.fillStyle = '#f7f4fa';
    ctx.font = '500 31px Arial';
    ctx.fillText(label, 36, 159);
    ctx.fillStyle = '#beadcb';
    ctx.font = '18px Arial';
    ctx.fillText(sublabel, 36, 206);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, [label, sublabel, symbol]);
  return (
    <group>
      <RoundedBox args={[1.62, 0.9, 0.075]} radius={0.035} smoothness={3}>
        <meshStandardMaterial color="#7c638c" metalness={0.8} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0, 0.042]}>
        <planeGeometry args={[1.58, 0.865]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}
export const routes = [
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.3, 0.1, 0.4),
    new THREE.Vector3(-0.8, 0.8, 1.2),
    new THREE.Vector3(-2.2, 0.95, 1.15),
  ]),
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.8, -0.2, 0.4),
    new THREE.Vector3(2, -0.9, 1.5),
    new THREE.Vector3(2.7, -0.65, 1.2),
  ]),
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.6, 0.3, 0.4),
    new THREE.Vector3(2, 1.65, 0.8),
    new THREE.Vector3(2.6, 1.85, 0.2),
  ]),
];
export function CommerceConnections() {
  return (
    <>
      {routes.map((route, index) => (
        <mesh key={index}>
          <tubeGeometry args={[route, 40, 0.012, 5, false]} />
          <meshBasicMaterial color="#b091c1" transparent opacity={0.55} />
        </mesh>
      ))}
      <group position={[-2.2, 0.95, 1.15]} rotation={[0, 0.25, -0.04]}>
        <LabelCard
          label="PAYMENTS"
          sublabel="A smoother checkout"
          symbol="payment"
        />
      </group>
      <group position={[2.7, -0.65, 1.2]} rotation={[0, -0.3, 0.06]}>
        <LabelCard
          label="SHIPPING"
          sublabel="Connected delivery"
          symbol="shipping"
        />
      </group>
      <group position={[2.6, 1.85, 0.2]} rotation={[0, -0.2, -0.04]}>
        <LabelCard
          label="LET’S TALK"
          sublabel="WhatsApp ordering"
          symbol="chat"
        />
      </group>
    </>
  );
}
