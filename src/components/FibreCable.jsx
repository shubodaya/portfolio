import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { sceneOrder } from "../data/profileData.js";

export const SECTION_STOPS = {
  hero: 0.04,
  services: 0.13,
  highlights: 0.24,
  projects: 0.35,
  "role-pages": 0.47,
  insights: 0.59,
  catalog: 0.7,
  resume: 0.82,
  contact: 0.91,
  outro: 0.96
};

export function createFibreCurve(compact = false) {
  const xScale = compact ? 0.58 : 1;
  const yScale = compact ? 0.82 : 1;
  const zScale = compact ? 0.78 : 1;
  const points = [
    [0, 0.78, 6.14],
    [0.16, 0.22, 4.82],
    [-0.12, -0.18, 3.02],
    [0.24, -0.55, 0.94],
    [-0.22, -0.82, -1.34],
    [0.18, -1.02, -3.94],
    [-0.17, -1.12, -6.78],
    [0.28, -0.95, -9.7],
    [-0.18, -0.72, -12.72],
    [0.1, -0.48, -15.72],
    [0, -0.22, -18.46]
  ].map(([x, y, z]) => new THREE.Vector3(x * xScale, y * yScale, z * zScale + (compact ? 1.1 : 0)));

  return new THREE.CatmullRomCurve3(points);
}

export function getCurvePoint(curve, sceneId) {
  return curve.getPointAt(SECTION_STOPS[sceneId] ?? 0);
}

export function getSceneIndex(sceneId) {
  return Math.max(0, sceneOrder.indexOf(sceneId));
}

function updateDrawRange(mesh, reveal) {
  if (!mesh?.geometry) return;
  const count = mesh.geometry.index?.count ?? mesh.geometry.attributes.position.count;
  mesh.geometry.setDrawRange(0, Math.max(1, Math.floor(count * reveal)));
}

export function FibreCable({ activeScene, curve, scrollProgress }) {
  const glowRef = useRef(null);
  const coreRef = useRef(null);
  const pulseRef = useRef(null);
  const haloRef = useRef(null);

  useFrame(({ clock }) => {
    const ending = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.9, 0.985);
    const presence = THREE.MathUtils.smoothstep(scrollProgress, 0.045, 0.16) * ending;
    const reveal = THREE.MathUtils.clamp((scrollProgress - 0.035) * 1.12, 0.001, 1);
    const pulse = 0.45 + Math.sin(clock.elapsedTime * 2.2 + scrollProgress * Math.PI * 5) * 0.18;
    updateDrawRange(haloRef.current, reveal);
    updateDrawRange(glowRef.current, reveal);
    updateDrawRange(coreRef.current, reveal);
    updateDrawRange(pulseRef.current, reveal);
    if (haloRef.current) {
      haloRef.current.material.opacity = presence * (0.028 + pulse * 0.016);
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = presence * (0.2 + pulse * 0.12);
    }
    if (coreRef.current) {
      coreRef.current.material.opacity = presence;
      coreRef.current.material.emissiveIntensity = 1.2 + pulse * 0.75;
    }
    if (pulseRef.current) {
      pulseRef.current.material.opacity = presence * (0.5 + pulse * 0.24);
    }
  });

  return (
    <group>
      <mesh ref={haloRef} renderOrder={-3}>
        <tubeGeometry args={[curve, 300, 0.052, 16, false]} />
        <meshBasicMaterial color="#68ffe0" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={glowRef} renderOrder={-2}>
        <tubeGeometry args={[curve, 300, 0.026, 18, false]} />
        <meshBasicMaterial color="#7af8ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={coreRef} renderOrder={-1}>
        <tubeGeometry args={[curve, 300, 0.009, 10, false]} />
        <meshStandardMaterial color="#f4ffff" depthWrite={false} emissive="#89fff3" emissiveIntensity={1.2} metalness={0.2} opacity={0} roughness={0.08} transparent />
      </mesh>
      <mesh ref={pulseRef} renderOrder={-1}>
        <tubeGeometry args={[curve, 300, 0.014, 10, false]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
