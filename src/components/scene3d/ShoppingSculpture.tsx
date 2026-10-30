import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
/** Original tapered, softly folded shopping sculpture. Managed/disposed by R3F. */
function useBodyGeometry() {
  return useMemo(() => {
    const geometry = new RoundedBoxGeometry(2.8, 2.64, 0.75, 6, 0.13);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i),
        y = positions.getY(i),
        z = positions.getZ(i);
      const fold =
        Math.sin(x * 4 + y * 0.7) * 0.035 * Math.max(0, 1 - (x / 1.4) ** 2);
      positions.setX(i, x * (1 - (y / 2.64 + 0.5) * 0.12));
      positions.setZ(i, z + fold * Math.min(1, Math.abs(z) * 3));
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);
}
export function BagBody() {
  const geometry = useBodyGeometry();
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#b392c3" metalness={0.88} roughness={0.27} />
    </mesh>
  );
}
function Ribbon({ z }: { z: number }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.69, 1.12, z),
      new THREE.Vector3(-0.98, 3.1, z - 0.12),
      new THREE.Vector3(0.98, 3.1, z - 0.12),
      new THREE.Vector3(0.69, 1.12, z),
    );
    const points = curve.getPoints(48),
      vertices: number[] = [],
      indices: number[] = [];
    points.forEach((p, i) => {
      vertices.push(p.x - 0.06, p.y, p.z, p.x + 0.06, p.y, p.z);
      if (i < points.length - 1) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, [z]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#dfc3df"
        metalness={0.85}
        roughness={0.23}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
export function BagHandles() {
  return (
    <>
      <Ribbon z={-0.24} />
      <Ribbon z={0.3} />
      {[-0.69, 0.69].map((x) => (
        <mesh key={x} position={[x, 1.12, 0.39]}>
          <sphereGeometry args={[0.042, 8, 6]} />
          <meshStandardMaterial
            color="#e8c8df"
            metalness={0.95}
            roughness={0.2}
          />
        </mesh>
      ))}
    </>
  );
}
export function BagEmblem() {
  return (
    <group position={[0, -0.18, 0.435]}>
      <mesh>
        <torusGeometry args={[0.3, 0.042, 6, 4]} />
        <meshStandardMaterial
          color="#e7cde0"
          metalness={0.9}
          roughness={0.23}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[0.065, 0.5, 0.026]} />
        <meshStandardMaterial
          color="#e7cde0"
          metalness={0.9}
          roughness={0.23}
        />
      </mesh>
    </group>
  );
}
