import * as THREE from 'three';
export const clamp = THREE.MathUtils.clamp;
/** Smooth, reversible ranges shared by every part of the scene. */
export function range(value: number, start: number, end: number) {
  const t = clamp((value - start) / (end - start), 0, 1);
  return t * t * (3 - 2 * t);
}
export function mix(a: number, b: number, t: number) {
  return THREE.MathUtils.lerp(a, b, t);
}
export type JourneyState = {
  progress: number;
  paused: boolean;
  reduced: boolean;
  invalidate?: () => void;
};
