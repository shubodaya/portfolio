import { RoundedBox, Text, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { sceneOrder } from "../data/profileData.js";
import { defaultThreeDContent } from "../data/threeDContent.js";
import {
  FIBRE_BRANCH_RELEASE,
  FIBRE_TILE_SCENES,
  FibreCable,
  SECTION_STOPS,
  createFibreCurve,
  getCurvePoint,
  getFibreFocusScene,
  getFibreSignalProgress,
  getFibreTileState,
  getSceneIndex
} from "./FibreCable.jsx";
import { SMark3D } from "./SMark3D.jsx";

const COLORS = {
  mint: "#76ffbf",
  cyan: "#7af8ff",
  violet: "#b99cff",
  amber: "#f4c86a"
};

function noise01(index, salt = 0) {
  return Math.sin(index * 19.47 + salt * 4.13) * 0.5 + 0.5;
}

const sectionColors = {
  hero: COLORS.mint,
  about: COLORS.amber,
  experience: COLORS.cyan,
  projects: COLORS.violet,
  skills: COLORS.violet,
  certifications: COLORS.mint,
  education: COLORS.cyan,
  contact: COLORS.mint,
  outro: COLORS.mint
};

const defaultTileImages = {
  hero: "/assets/portfolio/serverblue.png",
  about: "/assets/portfolio/story-security.png",
  experience: "/assets/projects/hero-command.jpg",
  projects: "/assets/portfolio/netravax.png",
  skills: "/assets/projects/site-security-browser.png",
  certifications: "/assets/projects/site-security-browser.png",
  education: "/assets/portfolio/story-security.png",
  contact: "/assets/portfolio/serverblue.png",
  outro: "/assets/portfolio/serverblue.png"
};

const sceneDisplayTitles = {
  hero: "Home",
  about: "About",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  education: "Education",
  contact: "Contact"
};

const internalRoutes = {
  hero: "/",
  about: "/about",
  experience: "/experience",
  projects: "/projects",
  skills: "/skills",
  certifications: "/certifications",
  education: "/education",
  contact: "/contact"
};

const getSectionRoute = (_threeDContent, scene) => internalRoutes[scene];

const tileSceneOrder = FIBRE_TILE_SCENES;

const INTRO_SHUTTER = {
  start: 0.018,
  finish: 0.098,
  fibreStart: 0.104,
  fibreReady: 0.135
};

const OUTRO_SHUTTER = {
  fibreFadeStart: 0.895,
  fibreFadeEnd: 0.952,
  logoStart: 0.956,
  logoReady: 0.985
};

function getFibrePresence(scrollProgress) {
  const intro = THREE.MathUtils.smoothstep(scrollProgress, INTRO_SHUTTER.fibreStart, INTRO_SHUTTER.fibreReady);
  const outro = 1 - THREE.MathUtils.smoothstep(scrollProgress, OUTRO_SHUTTER.fibreFadeStart, OUTRO_SHUTTER.fibreFadeEnd);
  return THREE.MathUtils.clamp(intro * outro, 0, 1);
}

function getHeroLogoPresence(scrollProgress) {
  return 1 - THREE.MathUtils.smoothstep(scrollProgress, INTRO_SHUTTER.start, INTRO_SHUTTER.finish);
}

function getOutroLogoPresence(scrollProgress) {
  return THREE.MathUtils.smoothstep(scrollProgress, OUTRO_SHUTTER.logoStart, OUTRO_SHUTTER.logoReady);
}

function getVisualScene(activeScene, scrollProgress) {
  if (scrollProgress > OUTRO_SHUTTER.fibreFadeStart) return "outro";
  if (scrollProgress > INTRO_SHUTTER.fibreStart) return getFibreFocusScene(getFibreSignalProgress(scrollProgress), "hero");
  return activeScene;
}

function useDisplayPrefs() {
  const [prefs, setPrefs] = useState({ compact: false, reduceMotion: false });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const update = () => {
      setPrefs({
        compact: window.innerWidth < 900 || coarse.matches,
        reduceMotion: media.matches
      });
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    media.addEventListener("change", update);
    coarse.addEventListener("change", update);

    return () => {
      window.removeEventListener("resize", update);
      media.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
    };
  }, []);

  return prefs;
}

function vectorFrom(point, offset) {
  return new THREE.Vector3(point.x + offset[0], point.y + offset[1], point.z + offset[2]);
}

function updateTubeDrawRange(mesh, reveal) {
  if (!mesh?.geometry) return;
  const count = mesh.geometry.index?.count ?? mesh.geometry.attributes.position.count;
  mesh.geometry.setDrawRange(0, Math.max(1, Math.floor(count * reveal)));
}

const focusAngles = {
  hero: 1.32,
  about: 2.28,
  experience: 0.86,
  projects: 2.48,
  skills: 0.68,
  certifications: 2.2,
  education: 0.96,
  contact: 2.42
};

function getTilePosition(curve, scene, compact, scrollProgress) {
  const branchProgress = getFibreTileState(scene, scrollProgress).progress;
  const anchor = scene === "outro" ? getCurvePoint(curve, scene) : curve.getPointAt(branchProgress);
  if (scene === "outro") return anchor.clone();

  const sectionStop = branchProgress;
  const radius = compact ? 2.72 : 4.68;
  const orbitSpeed = compact ? 3.4 : 5.15;
  const focusAngle = focusAngles[scene] ?? 1.15;
  const angle = focusAngle + (scrollProgress - sectionStop) * orbitSpeed;

  return new THREE.Vector3(
    anchor.x + Math.cos(angle) * radius,
    anchor.y,
    anchor.z + Math.sin(angle) * radius
  );
}

function getTileFaceYaw(position, compact) {
  const cameraZ = compact ? 11.65 : 14.55;
  const toCamera = new THREE.Vector3(-position.x, 0, cameraZ - position.z);
  return Math.atan2(toCamera.x, toCamera.z);
}

function getSceneDisplayTitle(scene, title) {
  return sceneDisplayTitles[scene] ?? title;
}

function connectorPointFor(position, compact, content) {
  const { height, width, scale } = getTileMetrics({ compact, ...content });
  const radial = new THREE.Vector3(position.x, 0, position.z);
  if (radial.lengthSq() < 0.001) {
    radial.set(position.x >= 0 ? 1 : -1, 0, 0);
  }
  radial.normalize();
  const edgeDistance = (width * scale) / 2 - (compact ? 0.08 : 0.16);
  const portY = (-height / 2 + (compact ? 0.44 : 0.58)) * scale;
  return position.clone().add(radial.multiplyScalar(-edgeDistance)).add(new THREE.Vector3(0, portY, 0.02));
}

function CameraRig({ activeScene, compact, curve, scrollProgress }) {
  const desired = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, pointer }, delta) => {
    const fibreProgress = getFibreSignalProgress(scrollProgress);
    const activeStop = getFibreTileState(activeScene, fibreProgress).progress ?? SECTION_STOPS[activeScene] ?? fibreProgress;
    const travel = THREE.MathUtils.clamp(THREE.MathUtils.lerp(fibreProgress, activeStop, 0.2), 0.02, 0.966);
    const point = curve.getPointAt(travel);
    const tilePoint = getTilePosition(curve, activeScene, compact, fibreProgress);
    const cameraZ = compact ? 11.65 : 14.55;

    if (activeScene === "hero" && scrollProgress < INTRO_SHUTTER.fibreStart) {
      const heroPoint = getCurvePoint(curve, "hero");
      desired.set(pointer.x * (compact ? 0.08 : 0.14), heroPoint.y + 0.48 + pointer.y * 0.12, cameraZ + 0.62);
      look.copy(heroPoint).add(new THREE.Vector3(0, compact ? 0.08 : 0.12, 0));
    } else if (activeScene === "outro") {
      const outroPoint = getCurvePoint(curve, "outro");
      desired.set(pointer.x * (compact ? 0.08 : 0.14), outroPoint.y + 0.5 + pointer.y * 0.12, cameraZ + 0.48);
      look.copy(outroPoint).add(new THREE.Vector3(0, compact ? 0.16 : 0.22, 0));
    } else {
      if (compact) {
        desired.set(tilePoint.x * 0.16 + pointer.x * 0.04, point.y + 0.32 + pointer.y * 0.05, cameraZ);
        look.copy(point).lerp(tilePoint, 0.44).add(new THREE.Vector3(0, 0.02, 0.04));
      } else {
        desired.set(tilePoint.x * 0.18 + pointer.x * 0.07, point.y + 0.5 + pointer.y * 0.08, cameraZ);
        look.copy(point).lerp(tilePoint, 0.42).add(new THREE.Vector3(0, 0.04, 0.04));
      }
    }
    look.y += compact ? 0.02 : 0.04;

    const ease = 1 - Math.pow(0.001, delta);
    camera.position.lerp(desired, ease * 0.3);
    camera.lookAt(look);
    camera.fov = THREE.MathUtils.lerp(camera.fov, activeScene === "hero" && scrollProgress < INTRO_SHUTTER.fibreStart ? (compact ? 52 : 46) : compact ? 48 : 42, 0.06);
    camera.updateProjectionMatrix();
  });

  return null;
}

function BranchCable({ activation = 0, branchTravel = 0, color = COLORS.cyan, curve, fromT, to, visible = true }) {
  const coreRef = useRef(null);
  const glowRef = useRef(null);
  const endpointRef = useRef(null);
  const packetRef = useRef(null);
  const packetGlowRef = useRef(null);
  const branchCurve = useMemo(() => {
    const start = curve.getPointAt(fromT);
    const end = to.clone();
    const radial = end.clone().sub(start);
    radial.y = 0;
    if (radial.lengthSq() < 0.001) radial.set(end.x >= start.x ? 1 : -1, 0, 0);
    radial.normalize();
    const midA = start.clone().add(radial.clone().multiplyScalar(0.72)).add(new THREE.Vector3(0, -0.12, 0));
    const midB = end.clone().add(radial.clone().multiplyScalar(-0.5)).add(new THREE.Vector3(0, 0.1, 0));
    return new THREE.CatmullRomCurve3([start, midA, midB, end]);
  }, [curve, fromT, to]);

  useFrame(({ clock }) => {
    const signal = visible ? THREE.MathUtils.clamp(activation, 0, 1) : 0;
    const travel = THREE.MathUtils.clamp(branchTravel, 0, 1);
    const pulse = signal * (0.07 + Math.sin(clock.elapsedTime * 4 + fromT * 10) * 0.025);
    const endpointSignal = signal * THREE.MathUtils.smoothstep(travel, 0.76, 1);
    const packetSignal = signal * Math.sin(Math.min(1, travel) * Math.PI);
    updateTubeDrawRange(glowRef.current, Math.max(0.015, travel));
    updateTubeDrawRange(coreRef.current, Math.max(0.015, travel));

    if (coreRef.current) {
      coreRef.current.material.opacity = THREE.MathUtils.lerp(coreRef.current.material.opacity, signal * 0.54, 0.1);
      coreRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(coreRef.current.material.emissiveIntensity, 0.08 + signal * 0.8, 0.1);
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, signal * (0.11 + pulse * 0.72), 0.1);
    }
    if (endpointRef.current) {
      endpointRef.current.material.opacity = THREE.MathUtils.lerp(endpointRef.current.material.opacity, endpointSignal * (0.34 + pulse), 0.1);
      endpointRef.current.scale.setScalar(THREE.MathUtils.lerp(endpointRef.current.scale.x, endpointSignal ? 1.12 + pulse : 0.72, 0.1));
    }

    [packetRef.current, packetGlowRef.current].forEach((packet, index) => {
      if (!packet) return;
      const point = branchCurve.getPointAt(Math.max(0.001, travel));
      packet.position.copy(point);
      packet.material.opacity = THREE.MathUtils.lerp(packet.material.opacity, packetSignal * (index === 0 ? 0.9 : 0.24), 0.14);
      packet.scale.setScalar(THREE.MathUtils.lerp(packet.scale.x, packetSignal ? 0.72 + travel * (index === 0 ? 0.42 : 0.86) : 0.2, 0.14));
    });
  });

  return (
    <>
      <mesh ref={glowRef}>
        <tubeGeometry args={[branchCurve, 42, 0.018, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={coreRef}>
        <tubeGeometry args={[branchCurve, 42, 0.006, 8, false]} />
        <meshStandardMaterial color="#061113" emissive={color} emissiveIntensity={0.2} metalness={0.5} opacity={0} roughness={0.22} transparent />
      </mesh>
      <mesh ref={endpointRef} position={to}>
        <boxGeometry args={[0.2, 0.075, 0.038]} />
        <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={packetGlowRef}>
        <sphereGeometry args={[0.076, 14, 14]} />
        <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.038, 14, 14]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}

function ScrollReactiveBackground({ activeScene, compact, scrollProgress }) {
  const groupRef = useRef(null);
  const pointsGeometry = useMemo(() => {
    const positions = [];
    const nodeCount = compact ? 18 : 30;
    const yTop = compact ? 5.3 : 6.2;
    const yBottom = compact ? -15.2 : -18.1;

    for (let index = 0; index < nodeCount; index += 1) {
      const t = index / Math.max(1, nodeCount - 1);
      const angle = index * 1.72;
      const radius = (compact ? 2.15 : 4.2) + noise01(index, 2) * (compact ? 0.9 : 1.8);
      positions.push(
        Math.cos(angle) * radius,
        THREE.MathUtils.lerp(yTop, yBottom, t) + Math.sin(index * 0.9) * (compact ? 0.16 : 0.34),
        Math.sin(angle) * radius * 0.72
      );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [compact]);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const section = getSceneIndex(activeScene);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, scrollProgress * Math.PI * 0.16, 0.035);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, Math.sin(scrollProgress * Math.PI * 2) * 0.12, 0.04);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.04);
    groupRef.current.children.forEach((child, index) => {
      if (child.material) {
        const outroFade = activeScene === "outro" ? 0.22 : 1;
        child.material.opacity = outroFade * (0.028 + Math.sin(clock.elapsedTime * 0.8 + section + index) * 0.01);
      }
    });
  });

  return (
    <group ref={groupRef}>
      <points geometry={pointsGeometry}>
        <pointsMaterial
          color="#7af8ff"
          size={compact ? 0.035 : 0.05}
          sizeAttenuation
          transparent
          opacity={0.045}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function TilePhotoLayer({ active, height, image, width }) {
  const texture = useTexture(image);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <mesh position={[0, 0, 0.045]} renderOrder={2}>
      <planeGeometry args={[width - 0.18, height - 0.18]} />
      <meshBasicMaterial color="#d7fff7" depthWrite={false} map={texture} opacity={active ? 0.028 : 0.012} transparent />
    </mesh>
  );
}

function TileReadabilityLayer({ active, height, width }) {
  return (
    <RoundedBox args={[width - 0.28, height - 0.34, 0.018]} position={[0, -0.02, 0.058]} radius={0.052} smoothness={5} renderOrder={3}>
      <meshBasicMaterial color="#02080b" depthWrite={false} opacity={active ? 0.68 : 0.34} transparent />
    </RoundedBox>
  );
}

function TileLogoLayer({ active, color, compact, icon, titleTop, width }) {
  const texture = useTexture(icon);
  const logoWidth = compact ? 0.56 : 0.72;
  const logoHeight = compact ? 0.36 : 0.48;
  const x = -width / 2 + 0.18 + logoWidth / 2;
  const y = titleTop - logoHeight / 2 + (compact ? 0.01 : 0.02);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <group position={[x, y, 0.095]} renderOrder={8}>
      <RoundedBox args={[logoWidth + 0.04, logoHeight + 0.04, 0.026]} radius={0.035} smoothness={5}>
        <meshBasicMaterial color="#061014" opacity={active ? 0.66 : 0.28} transparent depthWrite={false} />
      </RoundedBox>
      <mesh position={[0, 0, 0.018]}>
        <planeGeometry args={[logoWidth, logoHeight]} />
        <meshBasicMaterial map={texture} opacity={active ? 0.86 : 0.38} transparent depthWrite={false} />
      </mesh>
      <RoundedBox args={[logoWidth + 0.075, logoHeight + 0.075, 0.016]} position={[0, 0, -0.015]} radius={0.045} smoothness={5}>
        <meshBasicMaterial color={color} transparent opacity={active ? 0.1 : 0.03} blending={THREE.AdditiveBlending} depthWrite={false} />
      </RoundedBox>
    </group>
  );
}

function TileSignalRail({ active, color, compact, height, lineCount, width }) {
  const railRefs = useRef([]);
  const count = Math.min(compact ? 5 : 7, Math.max(4, lineCount + 1));
  const railHeight = height - (compact ? 0.78 : 0.92);
  const top = railHeight / 2;

  useFrame(({ clock }) => {
    railRefs.current.forEach((rail, index) => {
      if (!rail) return;
      const pulse = 0.5 + Math.sin(clock.elapsedTime * 2.2 + index * 0.74) * 0.5;
      rail.material.opacity = THREE.MathUtils.lerp(rail.material.opacity, active ? 0.12 + pulse * 0.18 : 0.025, 0.08);
      rail.scale.y = THREE.MathUtils.lerp(rail.scale.y, active ? 0.72 + pulse * 0.42 : 0.5, 0.08);
    });
  });

  return (
    <group position={[width / 2 - (compact ? 0.12 : 0.16), -0.04, 0.09]} renderOrder={7}>
      {Array.from({ length: count }).map((_, index) => {
        const y = top - (railHeight / Math.max(1, count - 1)) * index;
        const barHeight = compact ? 0.16 : 0.22;

        return (
          <mesh
            key={`rail-${index}`}
            position={[0, y, 0]}
            ref={(node) => {
              if (node) railRefs.current[index] = node;
            }}
          >
            <boxGeometry args={[compact ? 0.018 : 0.024, barHeight, 0.012]} />
            <meshBasicMaterial color={color} opacity={0.02} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function SectionGate({ activeScene, compact, curve, scrollProgress }) {
  const groupRef = useRef(null);
  const ringRefs = useRef([]);
  const lightRef = useRef(null);
  const point = useMemo(() => getCurvePoint(curve, activeScene), [activeScene, curve]);
  const color = sectionColors[activeScene] ?? COLORS.cyan;
  const hidden = activeScene === "hero" || activeScene === "outro";

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const gatePresence = hidden ? 0 : THREE.MathUtils.smoothstep(scrollProgress, 0.08, 0.94);
    const pulse = 0.5 + Math.sin(clock.elapsedTime * 2.4 + getSceneIndex(activeScene)) * 0.5;
    groupRef.current.rotation.z += compact ? 0.0022 : 0.0034;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.sin(clock.elapsedTime * 0.6) * 0.08, 0.04);
    ringRefs.current.forEach((ring, index) => {
      if (!ring) return;
      ring.material.opacity = THREE.MathUtils.lerp(ring.material.opacity, gatePresence * (0.12 + pulse * 0.12 - index * 0.025), 0.08);
      ring.scale.setScalar(THREE.MathUtils.lerp(ring.scale.x, 1 + pulse * 0.18 + index * 0.16, 0.08));
      ring.rotation.z += 0.002 + index * 0.001;
    });
    if (lightRef.current) {
      lightRef.current.intensity = gatePresence * (0.18 + pulse * 0.7);
    }
  });

  return (
    <group ref={groupRef} position={[point.x, point.y, point.z + 0.02]}>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          ref={(node) => {
            if (node) ringRefs.current[index] = node;
          }}
          rotation={[Math.PI / 2 + index * 0.16, index * 0.22, 0]}
        >
          <torusGeometry args={[compact ? 0.28 + index * 0.09 : 0.36 + index * 0.12, 0.006, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
      <pointLight color={color} distance={compact ? 2.4 : 3.4} intensity={0} ref={lightRef} />
    </group>
  );
}

function LogoFibreEmission({ compact, curve, mode = "intro", scrollProgress }) {
  const refs = useRef([]);
  const isIntro = mode === "intro";
  const origin = useMemo(() => {
    const scene = isIntro ? "hero" : "outro";
    const offset = isIntro ? [0, compact ? 0.34 : 0.42, 0.34] : [0, compact ? 0.56 : 0.72, 0.56];
    return vectorFrom(getCurvePoint(curve, scene), offset);
  }, [compact, curve, isIntro]);
  const particles = useMemo(
    () => {
      const count = compact ? 64 : 104;

      return Array.from({ length: count }, (_, index) => {
        const phase = index / Math.max(1, count - 1);
        const shapeScale = compact ? 0.74 : 0.92;
        const thickness = (noise01(index, 6) - 0.5) * (compact ? 0.14 : 0.2);
        const shape = new THREE.Vector3(
          Math.sin(phase * Math.PI * 2.04) * (compact ? 0.3 : 0.38) * shapeScale + thickness,
          THREE.MathUtils.lerp(compact ? 0.66 : 0.82, compact ? -0.66 : -0.82, phase) * shapeScale + (noise01(index, 7) - 0.5) * 0.08,
          (noise01(index, 8) - 0.5) * 0.08
        );

        return {
          color: index % 4 === 0 ? COLORS.cyan : index % 3 === 0 ? COLORS.amber : COLORS.mint,
          pathOffset: new THREE.Vector3(
            Math.sin(index * 2.13) * (compact ? 0.045 : 0.075),
            Math.cos(index * 1.71) * (compact ? 0.035 : 0.06),
            Math.sin(index * 0.87) * (compact ? 0.045 : 0.07)
          ),
          phase,
          scatter: new THREE.Vector3(
            (noise01(index, 1) - 0.5) * (compact ? 1.3 : 1.8),
            (noise01(index, 2) - 0.5) * (compact ? 0.7 : 1.0),
            (noise01(index, 3) - 0.5) * (compact ? 0.8 : 1.1)
          ),
          shape,
          size: (compact ? 0.017 : 0.024) + (index % 5) * 0.003
        };
      });
    },
    [compact]
  );

  useFrame(({ clock }) => {
    const introBirth = THREE.MathUtils.smoothstep(scrollProgress, 0.026, 0.074);
    const introScatter = THREE.MathUtils.smoothstep(scrollProgress, 0.045, 0.112);
    const introCable = THREE.MathUtils.smoothstep(scrollProgress, 0.096, 0.18);
    const introFade = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.235, 0.34);
    const outroBirth = THREE.MathUtils.smoothstep(scrollProgress, 0.884, 0.928);
    const outroGather = THREE.MathUtils.smoothstep(scrollProgress, 0.914, 0.976);
    const outroFade = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.988, 1);
    const presence = isIntro ? introBirth * introFade : outroBirth * outroFade;

    refs.current.forEach((node, index) => {
      if (!node) return;
      const particle = particles[index];
      const logoShape = particle.shape.clone();
      if (!isIntro) logoShape.x *= -1;
      const shapePoint = origin.clone().add(logoShape);
      const shimmer = 0.5 + Math.sin(clock.elapsedTime * 3.2 + index * 0.7) * 0.5;
      const target = new THREE.Vector3();

      if (isIntro) {
        const scattered = shapePoint.clone().add(particle.scatter.clone().multiplyScalar(introScatter * (1 - introCable)));
        const requestedTravel = 0.02 + introCable * (0.16 + particle.phase * 0.1) + Math.max(0, scrollProgress - 0.12) * 0.7;
        const signalTrailLimit = THREE.MathUtils.clamp(scrollProgress - (compact ? 0.012 : 0.016), 0.002, 0.34);
        const localTravel = THREE.MathUtils.clamp(Math.min(requestedTravel, signalTrailLimit), 0.002, 0.34);
        const cablePoint = curve.getPointAt(localTravel).add(particle.pathOffset.clone().multiplyScalar(1 - introCable * 0.88));
        target.copy(scattered).lerp(cablePoint, introCable);
      } else {
        const localTravel = THREE.MathUtils.clamp(0.835 + particle.phase * 0.13 - (1 - outroGather) * 0.08, 0.75, 0.966);
        const cablePoint = curve.getPointAt(localTravel).add(particle.scatter.clone().multiplyScalar((1 - outroGather) * 0.34));
        target.copy(cablePoint).lerp(shapePoint, outroGather);
      }

      node.position.copy(target);
      node.scale.setScalar(THREE.MathUtils.lerp(node.scale.x, presence * (0.48 + shimmer * 0.78), 0.12));
      node.material.opacity = THREE.MathUtils.lerp(node.material.opacity, presence * (0.14 + shimmer * 0.5), 0.1);
    });
  });

  return (
    <group>
      {particles.map((particle, index) => (
        <mesh
          key={`logo-emission-${index}`}
          ref={(node) => {
            if (node) refs.current[index] = node;
          }}
        >
          <sphereGeometry args={[particle.size, 10, 10]} />
          <meshBasicMaterial color={particle.color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function estimateTileLines(textItems, compact) {
  const wrapAt = compact ? 24 : 58;
  return textItems.reduce((total, item) => total + Math.max(1, Math.ceil(String(item ?? "").length / wrapAt)), 0);
}

function readTypographyScale(value, fallback, min, max) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? THREE.MathUtils.clamp(numeric, min, max) : fallback;
}

function cleanBulletText(value) {
  return String(value ?? "")
    .replace(/^\s*(?:[-*]|\u2022|â€¢)\s*/, "")
    .trim();
}

function getTileTypography(typography = {}) {
  return {
    titleScale: readTypographyScale(typography.titleScale, 1, 0.75, 1.45),
    bodyScale: readTypographyScale(typography.bodyScale, 1, 0.75, 1.55),
    kickerScale: readTypographyScale(typography.kickerScale, 1, 0.75, 1.3),
    lineHeightScale: readTypographyScale(typography.lineHeightScale, 1, 0.9, 1.25),
    tileScale: readTypographyScale(typography.tileScale, 1, 0.7, 1.2),
    tileWidthScale: readTypographyScale(typography.tileWidthScale, 1, 0.78, 1.22),
    tileHeightScale: readTypographyScale(typography.tileHeightScale, 1, 0.78, 1.24),
    buttonScale: readTypographyScale(typography.buttonScale, 1, 0.8, 1.35)
  };
}

function getTileMetrics({ body, compact, lines = [], scene, title, typography }) {
  const { bodyScale, tileHeightScale, tileScale, tileWidthScale } = getTileTypography(typography);
  const safeTitle = String(title ?? "");
  const longTitle = safeTitle.length > 48 || safeTitle.includes("\n");
  const estimatedLines = estimateTileLines(lines, compact) + Math.max(1, Math.ceil(String(body ?? "").length / (compact ? 23 : 48)));
  const dense = estimatedLines > (compact ? 6 : 7);
  const heightPad = Math.max(0, bodyScale - 1) * (compact ? 0.18 : 0.3);
  const baseHeight = compact ? (dense ? 3.54 : 3.14) : dense ? 3.86 : 3.46;
  const baseWidth = compact ? (dense ? 3.34 : 3.12) : dense ? 5.72 : 5.38;

  return {
    dense,
    height: (baseHeight + heightPad) * tileHeightScale,
    longTitle,
    scale: (compact ? 0.76 : 0.82) * tileScale,
    width: baseWidth * tileWidthScale
  };
}

function ContentTile3D({ activation = 0, body, color, compact, faceYaw = 0, href, icon, image, kicker, lines = [], navigate, position, presence = 1, scene, side = 1, title, typography }) {
  const groupRef = useRef(null);
  const panelRef = useRef(null);
  const glowRef = useRef(null);
  const isHero = false;
  const { bodyScale, buttonScale, kickerScale, lineHeightScale, titleScale } = getTileTypography(typography);
  const { dense, height, longTitle, scale: activeScale, width } = getTileMetrics({ body, compact, lines, scene, title, typography });
  const titleSize = (compact ? (longTitle ? 0.132 : 0.176) : isHero ? 0.24 : longTitle ? 0.248 : dense ? 0.34 : 0.38) * titleScale;
  const contentSize = (compact ? (dense ? 0.106 : 0.116) : dense ? 0.148 : 0.162) * bodyScale;
  const subtitleSize = contentSize;
  const bulletSize = contentSize;
  const bodyLineHeight = (compact ? 1.12 : 1.08) * lineHeightScale;
  const kickerSize = (compact ? 0.1 : isHero ? 0.118 : dense ? 0.122 : 0.138) * kickerScale;
  const ctaSize = (compact ? 0.102 : 0.142) * buttonScale;
  const bulletItems = lines.map(cleanBulletText).filter(Boolean);
  const portX = position.x >= 0 ? -width / 2 + 0.08 : width / 2 - 0.08;
  const portY = -height / 2 + (compact ? 0.44 : 0.58);
  const hasIcon = Boolean(icon);
  const logoReserve = hasIcon ? (compact ? 0.66 : 0.84) : 0;
  const inset = compact ? 0.2 : 0.28;
  const hasKicker = Boolean(kicker);
  const titleTop = height / 2 - (compact ? (hasKicker ? 0.34 : 0.24) : hasKicker ? 0.4 : 0.28);
  const subtitleY = titleTop - (compact ? 0.5 : 0.7);
  const bulletY = subtitleY - (compact ? 0.62 : 0.78);
  const bodyX = -width / 2 + inset;
  const bodyMaxWidth = width - inset * 2 - (compact ? 0.08 : 0.1);
  const columnWidth = bodyMaxWidth;
  const bulletIndent = compact ? 0.17 : 0.24;
  const bulletTextWidth = columnWidth - bulletIndent;
  const bulletLineUnit = bulletSize * bodyLineHeight * (compact ? 1.42 : 1.34);
  const bulletGap = compact ? 0.055 : 0.075;
  let bulletCursor = bulletY;
  const bulletRows = bulletItems.map((item) => {
    const estimatedRows = Math.max(1, Math.ceil(item.length / (compact ? 36 : 58)));
    const y = bulletCursor;
    bulletCursor -= estimatedRows * bulletLineUnit + bulletGap;

    return { item, y };
  });
  const buttonWidth = (compact ? Math.min(1.62, width - 0.54) : 2.06) * buttonScale;
  const buttonHeight = (compact ? 0.34 : 0.42) * buttonScale;
  const buttonY = -height / 2 + (compact ? 0.3 : 0.38);
  const showOpenButton = scene !== "hero";

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const activeAmount = THREE.MathUtils.clamp(activation, 0, 1);
    const inactiveScale = compact ? 0.34 : 0.34;
    const targetScale = presence * THREE.MathUtils.lerp(inactiveScale, activeScale, activeAmount);
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.16));
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      faceYaw + side * THREE.MathUtils.lerp(0.34, 0.02, activeAmount) + pointer.x * 0.018,
      0.08
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * -0.018, 0.05);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, position.x, 0.14);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position.y + Math.sin(clock.elapsedTime * 1.1 + position.x) * 0.01, 0.14);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position.z, 0.14);

    if (panelRef.current) {
      panelRef.current.material.opacity = THREE.MathUtils.lerp(panelRef.current.material.opacity, presence * THREE.MathUtils.lerp(0.18, 0.92, activeAmount), 0.08);
      panelRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(panelRef.current.material.emissiveIntensity, THREE.MathUtils.lerp(0.06, 0.24, activeAmount), 0.08);
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, presence * THREE.MathUtils.lerp(0.018, 0.16, activeAmount), 0.08);
    }
  });

  const activeVisual = activation > 0.08;

  return (
    <group
      ref={groupRef}
      position={position}
      scale={presence * THREE.MathUtils.lerp(compact ? 0.34 : 0.34, activeScale, THREE.MathUtils.clamp(activation, 0, 1))}
      onClick={(event) => {
        event.stopPropagation();
        if (!href || presence < 0.18) return;
        if (href.startsWith("/")) {
          if (href === "/" && window.location.pathname === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
          navigate(href);
          return;
        }
        window.location.href = href;
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = href && presence >= 0.18 ? "pointer" : "";
      }}
    >
      <mesh position={[0, 0, 0.14]} renderOrder={8}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <RoundedBox ref={panelRef} args={[width, height, 0.07]} radius={0.055} smoothness={6}>
        <meshPhysicalMaterial
          clearcoat={0.8}
          color="#061014"
          emissive={color}
          emissiveIntensity={0.1}
          metalness={0.2}
          roughness={0.28}
          transparent
        />
      </RoundedBox>
      <RoundedBox ref={glowRef} args={[width + 0.08, height + 0.08, 0.028]} position={[0, 0, -0.05]} radius={0.08} smoothness={6}>
        <meshBasicMaterial color={color} transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
      </RoundedBox>
      <TilePhotoLayer active={activeVisual} height={height} image={image} width={width} />
      <TileReadabilityLayer active={activeVisual} height={height} width={width} />
      {hasIcon ? <TileLogoLayer active={activeVisual} color={color} compact={compact} icon={icon} titleTop={titleTop} width={width} /> : null}
      <TileSignalRail active={activeVisual} color={color} compact={compact} height={height} lineCount={lines.length} width={width} />
      <mesh position={[portX, portY, 0.115]} renderOrder={7}>
        <boxGeometry args={[0.18, 0.072, 0.042]} />
        <meshBasicMaterial color={color} transparent opacity={presence * THREE.MathUtils.lerp(0.16, 0.68, THREE.MathUtils.clamp(activation, 0, 1))} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {hasKicker ? (
        <Text
          anchorX="left"
          anchorY="top"
          color={color}
          fontSize={kickerSize}
          material-depthTest={false}
          maxWidth={width - 0.34}
          position={[-width / 2 + 0.18, height / 2 - 0.18, 0.07]}
          renderOrder={6}
        >
          {kicker}
        </Text>
      ) : null}
      <Text
        anchorX="left"
        anchorY="top"
        color="#f4fbff"
        fontSize={titleSize}
        fontWeight={800}
        lineHeight={0.96}
        material-depthTest={false}
        maxWidth={width - 0.34 - logoReserve}
        position={[-width / 2 + 0.18 + logoReserve, titleTop, 0.07]}
        renderOrder={6}
      >
        {title}
      </Text>
      <Text
        anchorX="left"
        anchorY="top"
        color="#d7e6ea"
        fontSize={subtitleSize}
        lineHeight={bodyLineHeight}
        material-depthTest={false}
        maxWidth={bodyMaxWidth}
        position={[bodyX, subtitleY, 0.07]}
        renderOrder={6}
      >
        {body}
      </Text>
      {bulletRows.map(({ item, y }, index) => (
        <group key={`bullet-${scene}-${index}`} renderOrder={6}>
          <Text
            anchorX="left"
            anchorY="top"
            color="#e6f4f6"
            fontSize={bulletSize}
            lineHeight={bodyLineHeight}
            material-depthTest={false}
            maxWidth={bulletIndent}
            position={[bodyX, y, 0.07]}
            renderOrder={6}
          >
            •
          </Text>
          <Text
            anchorX="left"
            anchorY="top"
            color="#e6f4f6"
            fontSize={bulletSize}
            lineHeight={bodyLineHeight}
            material-depthTest={false}
            maxWidth={bulletTextWidth}
            position={[bodyX + bulletIndent, y, 0.07]}
            renderOrder={6}
          >
            {item}
          </Text>
        </group>
      ))}
      {showOpenButton ? (
        <group position={[0, buttonY, 0.105]} renderOrder={9}>
          <RoundedBox args={[buttonWidth, buttonHeight, 0.038]} radius={0.055} smoothness={5}>
            <meshBasicMaterial color={color} transparent opacity={presence * THREE.MathUtils.lerp(0.2, 0.44, THREE.MathUtils.clamp(activation, 0, 1))} blending={THREE.AdditiveBlending} depthWrite={false} />
          </RoundedBox>
          <RoundedBox args={[buttonWidth - 0.045, buttonHeight - 0.045, 0.032]} position={[0, 0, 0.02]} radius={0.045} smoothness={5}>
            <meshPhysicalMaterial color="#061014" emissive={color} emissiveIntensity={THREE.MathUtils.lerp(0.08, 0.26, THREE.MathUtils.clamp(activation, 0, 1))} metalness={0.22} opacity={0.94} roughness={0.3} transparent />
          </RoundedBox>
          <Text
            anchorX="center"
            anchorY="middle"
            color="#f4fbff"
            fontSize={ctaSize}
            fontWeight={800}
            letterSpacing={0}
            material-depthTest={false}
            maxWidth={buttonWidth - 0.24}
            position={[0, 0.002, 0.055]}
            renderOrder={10}
          >
            Open Section
          </Text>
        </group>
      ) : null}
    </group>
  );
}

function makeTileContent(threeDContent) {
  return threeDContent.tiles ?? defaultThreeDContent.tiles;
}

function RunwayTiles({ compact, curve, fibrePresence, fibreProgress, navigate, scrollProgress, threeDContent }) {
  const tileContent = useMemo(() => makeTileContent(threeDContent), [threeDContent]);
  const focusTileScene = getFibreFocusScene(fibreProgress, "hero");
  const activeIndex = Math.max(0, tileSceneOrder.indexOf(focusTileScene));
  const entryPresence = THREE.MathUtils.smoothstep(scrollProgress, 0.108, 0.135);
  const outroFade = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.875, 0.93);
  const tileFieldPresence = entryPresence * outroFade * fibrePresence;

  return (
    <group visible={tileFieldPresence > 0.01}>
      {tileSceneOrder.map((scene) => {
        const tileState = getFibreTileState(scene, fibreProgress);
        const activation = tileFieldPresence * tileState.activation;
        const sceneIndex = tileSceneOrder.indexOf(scene);
        const nearby = Math.abs(sceneIndex - activeIndex) <= 1;
        const tileShrinkStartsAt = FIBRE_BRANCH_RELEASE * 0.74;
        const branchVisible = tileFieldPresence > 0.08 && tileState.reached && tileState.distance <= tileShrinkStartsAt && (activation > 0.01 || nearby);
        const content = tileContent[scene] ?? defaultThreeDContent.tiles[scene];
        if (!content) return null;
        const color = sectionColors[scene] ?? COLORS.mint;
        const href = getSectionRoute(threeDContent, scene);
        const image = content.image || defaultTileImages[scene];
        const position = getTilePosition(curve, scene, compact, fibreProgress);
        const faceYaw = getTileFaceYaw(position, compact);

        return (
          <group key={scene}>
            {branchVisible ? (
              <BranchCable
                activation={activation}
                branchTravel={tileState.branchTravel}
                color={color}
                curve={curve}
                fromT={tileState.progress}
                to={connectorPointFor(position, compact, { ...content, scene })}
                visible
              />
            ) : null}
            <ContentTile3D
              activation={activation}
              body={content.body}
              color={color}
              compact={compact}
              href={href}
              icon={content.icon}
              kicker={content.kicker}
              lines={content.lines}
              image={image}
              faceYaw={faceYaw}
              navigate={navigate}
              position={position}
              presence={tileFieldPresence}
              scene={scene}
              side={position.x >= 0 ? 1 : -1}
              title={getSceneDisplayTitle(scene, content.title)}
              typography={content.typography}
            />
          </group>
        );
      })}
    </group>
  );
}

function ContactOutroS({ activeScene, compact, curve, navigate, scrollProgress }) {
  const reform = getOutroLogoPresence(scrollProgress);
  const active = activeScene === "outro" || reform > 0.55;
  const point = useMemo(() => vectorFrom(getCurvePoint(curve, "outro"), [0, compact ? 0.56 : 0.72, 0.54]), [compact, curve]);

  if (reform <= 0.01 && activeScene !== "contact" && activeScene !== "outro") return null;

  return (
    <SMark3D
      active={active}
      compact={compact}
      href={internalRoutes.hero}
      navigate={navigate}
      opacity={reform}
      position={point}
      scale={active ? (compact ? 0.96 : 1.18) : compact ? 0.42 : 0.5}
      scrollProgress={scrollProgress}
    />
  );
}

function SceneLights({ activeScene, curve }) {
  const activePoint = useMemo(() => getCurvePoint(curve, activeScene), [activeScene, curve]);

  return (
    <>
      <ambientLight intensity={0.42} />
      <directionalLight color="#effcff" intensity={0.82} position={[-3, 4, 7]} />
      <directionalLight color={COLORS.violet} intensity={0.2} position={[4, -2, 2]} />
      <pointLight color={sectionColors[activeScene] ?? COLORS.mint} distance={8} intensity={1.7} position={[activePoint.x, activePoint.y + 1.1, activePoint.z + 1.7]} />
    </>
  );
}

function SecurityWorld({ activeScene, compact, navigate, scrollProgress, threeDContent }) {
  const curve = useMemo(() => createFibreCurve(compact), [compact]);
  const heroSPoint = useMemo(() => getCurvePoint(curve, "hero").add(new THREE.Vector3(0, compact ? 0.34 : 0.42, 0.08)), [compact, curve]);
  const fibrePresence = getFibrePresence(scrollProgress);
  const fibreProgress = getFibreSignalProgress(scrollProgress);
  const heroSPresence = getHeroLogoPresence(scrollProgress);
  const visualScene = getVisualScene(activeScene, scrollProgress);
  const showHeroS = heroSPresence > 0.01;
  const heroSScale = compact ? 0.82 : 1.16;

  return (
    <>
      <color attach="background" args={["#020305"]} />
      <fog attach="fog" args={["#020305", compact ? 5 : 6.5, compact ? 25 : 36]} />
      <CameraRig activeScene={visualScene} compact={compact} curve={curve} scrollProgress={scrollProgress} />
      <SceneLights activeScene={visualScene} curve={curve} />
      {showHeroS ? (
        <SMark3D
          active={activeScene === "hero"}
          compact={compact}
          href={internalRoutes.hero}
          navigate={navigate}
          opacity={heroSPresence}
          position={heroSPoint}
          scale={heroSScale}
          scrollProgress={scrollProgress}
        />
      ) : null}
      <LogoFibreEmission compact={compact} curve={curve} mode="intro" scrollProgress={scrollProgress} />
      <FibreCable compact={compact} curve={curve} presence={fibrePresence} scrollProgress={scrollProgress} signalProgress={fibreProgress} />
      <RunwayTiles compact={compact} curve={curve} fibrePresence={fibrePresence} fibreProgress={fibreProgress} navigate={navigate} scrollProgress={scrollProgress} threeDContent={threeDContent} />
      <LogoFibreEmission compact={compact} curve={curve} mode="outro" scrollProgress={scrollProgress} />
      <ContactOutroS activeScene={activeScene} compact={compact} curve={curve} navigate={navigate} scrollProgress={scrollProgress} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={compact ? 0.2 : 0.28} luminanceThreshold={0.18} mipmapBlur radius={compact ? 0.22 : 0.3} />
      </EffectComposer>
    </>
  );
}

function StaticFallback() {
  return (
    <div className="scene-static" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

export default function Scene3D({ activeScene, scrollProgress, threeDContent = defaultThreeDContent }) {
  const { compact, reduceMotion } = useDisplayPrefs();
  const navigate = useNavigate();

  if (reduceMotion) {
    return <StaticFallback />;
  }

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 1.2, compact ? 12.2 : 15.2], fov: compact ? 52 : 48, near: 0.1, far: 100 }}
      className="scene-canvas"
      dpr={compact ? [1, 1.1] : [1, 1.45]}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <SecurityWorld activeScene={activeScene} compact={compact} navigate={navigate} scrollProgress={scrollProgress} threeDContent={threeDContent} />
    </Canvas>
  );
}
