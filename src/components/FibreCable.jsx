import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { sceneOrder } from "../data/profileData.js";
import { scrollState } from "./scrollProgressStore.js";

export const SECTION_STOPS = {
  hero: 0.035,
  about: 0.15,
  experience: 0.27,
  projects: 0.39,
  skills: 0.51,
  certifications: 0.63,
  education: 0.75,
  contact: 0.87,
  outro: 0.96
};

export const FIBRE_TILE_POINTS = [
  { scene: "hero", progress: 0.155 },
  { scene: "about", progress: 0.255 },
  { scene: "experience", progress: 0.355 },
  { scene: "projects", progress: 0.455 },
  { scene: "skills", progress: 0.555 },
  { scene: "certifications", progress: 0.655 },
  { scene: "education", progress: 0.755 },
  { scene: "contact", progress: 0.855 }
];

export const FIBRE_TILE_SCENES = FIBRE_TILE_POINTS.map((point) => point.scene);
export const FIBRE_BRANCH_RELEASE = 0.074;
export const FIBRE_BRANCH_TRAVEL = 0.024;

const spineSceneOrder = [
  "hero",
  "about",
  "experience",
  "projects",
  "skills",
  "certifications",
  "education",
  "contact",
  "outro",
  ...sceneOrder
].filter((scene, index, scenes) => scenes.indexOf(scene) === index);

export function getFibreSignalProgress(scrollProgress) {
  return THREE.MathUtils.clamp(scrollProgress, 0, 1);
}

export function getFibreTilePoint(scene) {
  return FIBRE_TILE_POINTS.find((point) => point.scene === scene);
}

export function getFibreTileActivation(scene, fibreProgress) {
  const point = getFibreTilePoint(scene);
  if (!point) return 0;

  const distance = fibreProgress - point.progress;
  if (distance < 0) return 0;

  return 1 - THREE.MathUtils.smoothstep(distance, FIBRE_BRANCH_RELEASE * 0.74, FIBRE_BRANCH_RELEASE);
}

export function getFibreBranchTravel(scene, fibreProgress) {
  const point = getFibreTilePoint(scene);
  if (!point) return 0;

  return THREE.MathUtils.smoothstep(fibreProgress, point.progress, point.progress + FIBRE_BRANCH_TRAVEL);
}

export function getFibreTileState(scene, fibreProgress) {
  const point = getFibreTilePoint(scene);
  const progress = point?.progress ?? SECTION_STOPS[scene] ?? fibreProgress;
  const distance = fibreProgress - progress;

  return {
    activation: getFibreTileActivation(scene, fibreProgress),
    branchTravel: getFibreBranchTravel(scene, fibreProgress),
    distance,
    progress,
    reached: distance >= 0
  };
}

export function getFibreFocusScene(fibreProgress, fallback = "hero") {
  const active = FIBRE_TILE_POINTS
    .map((point) => ({
      ...point,
      activation: getFibreTileActivation(point.scene, fibreProgress)
    }))
    .filter((point) => point.activation > 0.015)
    .sort((a, b) => b.activation - a.activation)[0];

  if (active) return active.scene;

  const reached = [...FIBRE_TILE_POINTS]
    .reverse()
    .find((point) => fibreProgress >= point.progress);

  return reached?.scene ?? fallback;
}

export function createFibreCurve(compact = false) {
  const xScale = compact ? 0.56 : 1;
  const yScale = compact ? 0.82 : 1;
  const zScale = compact ? 0.62 : 1;
  const points = [
    [0, 6.2, 0.08],
    [0.08, 4.8, -0.03],
    [-0.1, 2.6, 0.05],
    [0.12, 0.2, -0.04],
    [-0.12, -2.25, 0.04],
    [0.1, -4.95, -0.05],
    [-0.08, -7.65, 0.04],
    [0.1, -10.35, -0.04],
    [-0.08, -13.05, 0.05],
    [0.06, -15.7, -0.03],
    [0, -18.1, 0.04]
  ].map(([x, y, z]) => new THREE.Vector3(x * xScale, y * yScale, z * zScale));

  return new THREE.CatmullRomCurve3(points);
}

export function getCurvePoint(curve, sceneId) {
  return curve.getPointAt(SECTION_STOPS[sceneId] ?? 0);
}

export function getSceneIndex(sceneId) {
  return Math.max(0, spineSceneOrder.indexOf(sceneId));
}

const Y_AXIS = new THREE.Vector3(0, 1, 0);

function updateDrawRange(mesh, reveal) {
  if (!mesh?.geometry) return;
  const count = mesh.geometry.index?.count ?? mesh.geometry.attributes.position.count;
  mesh.geometry.setDrawRange(0, Math.max(1, Math.floor(count * reveal)));
}

function createSleeveGlintCurve(curve, radius, phase, compact) {
  const points = [];
  const sampleCount = compact ? 72 : 96;

  for (let index = 0; index < sampleCount; index += 1) {
    const t = index / Math.max(1, sampleCount - 1);
    const base = curve.getPointAt(t);
    const twist = phase + t * Math.PI * 5.2;
    points.push(
      base.clone().add(
        new THREE.Vector3(
          Math.cos(twist) * radius,
          0,
          Math.sin(twist) * radius * 0.62
        )
      )
    );
  }

  return new THREE.CatmullRomCurve3(points);
}

function CableDataPulse({ compact, curve, getPresence, index }) {
  const packetRef = useRef(null);
  const glowRef = useRef(null);

  useFrame(({ clock }) => {
    const scrollProgress = scrollState.progress;
    const reveal = THREE.MathUtils.clamp(THREE.MathUtils.smoothstep(scrollProgress, 0.104, 0.96), 0.08, 1);
    const packetPresence = THREE.MathUtils.clamp(getPresence(), 0, 1);
    const speed = compact ? 0.04 : 0.032;
    const t = (index * 0.19 + scrollProgress * 0.34 + clock.elapsedTime * speed) % reveal;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const packetScale = 0.72 + Math.sin((t + clock.elapsedTime * 0.12) * Math.PI * 2) * 0.18;
    const opacity = packetPresence * (0.28 + Math.sin(t * Math.PI) * 0.55);

    [packetRef.current, glowRef.current].forEach((node) => {
      if (!node) return;
      node.position.copy(point);
      node.quaternion.setFromUnitVectors(Y_AXIS, tangent);
    });

    if (packetRef.current) {
      packetRef.current.scale.setScalar(packetScale);
      packetRef.current.material.opacity = THREE.MathUtils.lerp(packetRef.current.material.opacity, opacity, 0.14);
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(packetScale * 1.4);
      glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, opacity * 0.22, 0.14);
    }
  });

  return (
    <>
      <mesh ref={glowRef} renderOrder={-1}>
        <capsuleGeometry args={[compact ? 0.026 : 0.035, compact ? 0.13 : 0.18, 6, 14]} />
        <meshBasicMaterial color="#7af8ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={packetRef} renderOrder={0}>
        <capsuleGeometry args={[compact ? 0.009 : 0.012, compact ? 0.12 : 0.18, 5, 12]} />
        <meshBasicMaterial color={index % 3 === 0 ? "#ffffff" : "#85fff0"} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}

function FibreSignalHead({ compact, curve, getPresence }) {
  const coreRef = useRef(null);
  const glowRef = useRef(null);

  useFrame(({ clock }) => {
    const presence = THREE.MathUtils.clamp(getPresence(), 0, 1);
    const progress = THREE.MathUtils.clamp(getFibreSignalProgress(scrollState.progress), 0.001, 0.965);
    const point = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(progress).normalize();
    const pulse = 0.72 + Math.sin(clock.elapsedTime * 5.4 + progress * Math.PI * 6) * 0.28;

    [coreRef.current, glowRef.current].forEach((node) => {
      if (!node) return;
      node.position.copy(point);
      node.quaternion.setFromUnitVectors(Y_AXIS, tangent);
    });

    if (coreRef.current) {
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, 0.82 + pulse * 0.32, 0.16));
      coreRef.current.material.opacity = THREE.MathUtils.lerp(coreRef.current.material.opacity, presence * 0.92, 0.12);
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(THREE.MathUtils.lerp(glowRef.current.scale.x, 1.08 + pulse * 0.55, 0.16));
      glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, presence * 0.28, 0.12);
    }
  });

  return (
    <>
      <mesh ref={glowRef} renderOrder={1}>
        <sphereGeometry args={[compact ? 0.09 : 0.12, 18, 18]} />
        <meshBasicMaterial color="#76ffbf" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={coreRef} renderOrder={2}>
        <capsuleGeometry args={[compact ? 0.018 : 0.024, compact ? 0.13 : 0.18, 8, 18]} />
        <meshBasicMaterial color="#f4ffff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}

export function FibreCable({ compact = false, curve, getPresence }) {
  const groupRef = useRef(null);
  const sleeveGlowRef = useRef(null);
  const sleeveRef = useRef(null);
  const innerGlowRef = useRef(null);
  const coreRef = useRef(null);
  const highlightARef = useRef(null);
  const highlightBRef = useRef(null);
  const glintCurveA = useMemo(() => createSleeveGlintCurve(curve, compact ? 0.026 : 0.038, 0.2, compact), [compact, curve]);
  const glintCurveB = useMemo(() => createSleeveGlintCurve(curve, compact ? 0.022 : 0.034, Math.PI + 0.4, compact), [compact, curve]);

  useFrame(({ clock }) => {
    const scrollProgress = scrollState.progress;
    const spinePresence = THREE.MathUtils.clamp(getPresence(), 0, 1);
    if (groupRef.current) {
      groupRef.current.visible = spinePresence > 0.001;
      if (!groupRef.current.visible) return;
    }
    const reveal = THREE.MathUtils.clamp(getFibreSignalProgress(scrollProgress), 0.001, 0.965);
    const pulse = 0.5 + Math.sin(clock.elapsedTime * 1.7 + scrollProgress * Math.PI * 5) * 0.5;
    updateDrawRange(sleeveGlowRef.current, reveal);
    updateDrawRange(sleeveRef.current, reveal);
    updateDrawRange(innerGlowRef.current, reveal);
    updateDrawRange(coreRef.current, reveal);
    updateDrawRange(highlightARef.current, reveal);
    updateDrawRange(highlightBRef.current, reveal);
    if (sleeveGlowRef.current) {
      sleeveGlowRef.current.material.opacity = spinePresence * (0.04 + pulse * 0.035);
    }
    if (sleeveRef.current) {
      sleeveRef.current.material.opacity = spinePresence * 0.32;
      sleeveRef.current.material.emissiveIntensity = 0.07 + pulse * 0.03;
    }
    if (innerGlowRef.current) {
      innerGlowRef.current.material.opacity = spinePresence * (0.14 + pulse * 0.08);
    }
    if (coreRef.current) {
      coreRef.current.material.opacity = spinePresence * (0.78 + pulse * 0.14);
      coreRef.current.material.emissiveIntensity = 1.1 + pulse * 0.7;
    }
    if (highlightARef.current) {
      highlightARef.current.material.opacity = spinePresence * (0.16 + pulse * 0.06);
    }
    if (highlightBRef.current) {
      highlightBRef.current.material.opacity = spinePresence * (0.08 + pulse * 0.04);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh ref={sleeveGlowRef} renderOrder={-4}>
        <tubeGeometry args={[curve, 360, compact ? 0.072 : 0.092, 26, false]} />
        <meshBasicMaterial color="#2fffe1" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={sleeveRef} renderOrder={-3}>
        <tubeGeometry args={[curve, 360, compact ? 0.044 : 0.058, 28, false]} />
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.05}
          color="#07191b"
          emissive="#0b8d88"
          emissiveIntensity={0.08}
          metalness={0.04}
          opacity={0}
          roughness={0.08}
          thickness={0.28}
          transmission={0.42}
          transparent
        />
      </mesh>
      <mesh ref={innerGlowRef} renderOrder={-2}>
        <tubeGeometry args={[curve, 360, compact ? 0.022 : 0.03, 18, false]} />
        <meshBasicMaterial color="#49ffe6" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={coreRef} renderOrder={-1}>
        <tubeGeometry args={[curve, 360, compact ? 0.008 : 0.011, 14, false]} />
        <meshStandardMaterial color="#f4ffff" depthWrite={false} emissive="#9afff6" emissiveIntensity={1.2} metalness={0.08} opacity={0} roughness={0.05} transparent />
      </mesh>
      <mesh ref={highlightARef} renderOrder={-1}>
        <tubeGeometry args={[glintCurveA, 220, compact ? 0.0028 : 0.0038, 7, false]} />
        <meshBasicMaterial color="#e6fffb" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={highlightBRef} renderOrder={-1}>
        <tubeGeometry args={[glintCurveB, 220, compact ? 0.0022 : 0.0032, 7, false]} />
        <meshBasicMaterial color="#7af8ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {Array.from({ length: compact ? 4 : 6 }).map((_, index) => (
        <CableDataPulse compact={compact} curve={curve} getPresence={getPresence} index={index} key={`fibre-pulse-${index}`} />
      ))}
      <FibreSignalHead compact={compact} curve={curve} getPresence={getPresence} />
    </group>
  );
}
