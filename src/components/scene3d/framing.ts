import * as THREE from 'three';

/** Reused scratch objects: no frame-by-frame geometry allocations. */
export function createCameraFramer() {
  const bounds = new THREE.Box3();
  const transformed = new THREE.Box3();
  const center = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const point = new THREE.Vector3();
  const corners = Array.from({ length: 8 }, () => new THREE.Vector3());

  function collect(object: THREE.Object3D) {
    if (!object.visible) return;
    if (object instanceof THREE.Mesh) {
      if (!object.geometry.boundingBox) object.geometry.computeBoundingBox();
      if (object.geometry.boundingBox) {
        transformed
          .copy(object.geometry.boundingBox)
          .applyMatrix4(object.matrixWorld);
        bounds.union(transformed);
      }
    }
    object.children.forEach(collect);
  }

  return function frame(
    object: THREE.Object3D,
    camera: THREE.PerspectiveCamera,
    yaw: number,
    pitch: number,
    padding = 0.87,
  ) {
    object.updateWorldMatrix(true, true);
    bounds.makeEmpty();
    collect(object);
    if (bounds.isEmpty()) return '';
    bounds.getCenter(center);
    direction.set(
      Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      Math.cos(yaw) * Math.cos(pitch),
    );
    right.crossVectors(camera.up, direction).normalize();
    up.crossVectors(direction, right).normalize();
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    let distance = 0;
    corners.forEach((corner, index) => {
      corner.set(
        index & 1 ? bounds.max.x : bounds.min.x,
        index & 2 ? bounds.max.y : bounds.min.y,
        index & 4 ? bounds.max.z : bounds.min.z,
      );
      offset.copy(corner).sub(center);
      distance = Math.max(
        distance,
        offset.dot(direction) + Math.abs(offset.dot(up)) / (tangent * padding),
        offset.dot(direction) +
          Math.abs(offset.dot(right)) / (tangent * camera.aspect * padding),
      );
    });
    camera.position.copy(center).addScaledVector(direction, distance);
    camera.lookAt(center);
    camera.updateMatrixWorld();
    let maxX = 0,
      maxY = 0;
    corners.forEach((corner) => {
      point.copy(corner).project(camera);
      maxX = Math.max(maxX, Math.abs(point.x));
      maxY = Math.max(maxY, Math.abs(point.y));
    });
    return `${maxX.toFixed(3)},${maxY.toFixed(3)}`;
  };
}
