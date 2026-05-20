import { RoundedBox, Text, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { profile, sceneOrder } from "../data/profileData.js";
import { defaultThreeDContent } from "../data/threeDContent.js";
import { FibreCable, SECTION_STOPS, createFibreCurve, getCurvePoint, getSceneIndex } from "./FibreCable.jsx";
import { PacketLights } from "./PacketLights.jsx";
import { SMark3D } from "./SMark3D.jsx";

const COLORS = {
  mint: "#76ffbf",
  cyan: "#7af8ff",
  violet: "#b99cff",
  amber: "#f4c86a"
};

const sectionColors = {
  hero: COLORS.mint,
  services: COLORS.cyan,
  highlights: COLORS.amber,
  projects: COLORS.violet,
  "role-pages": COLORS.mint,
  insights: COLORS.cyan,
  contact: COLORS.mint,
  catalog: COLORS.violet,
  resume: COLORS.amber,
  outro: COLORS.mint
};

const defaultTileImages = {
  hero: "/assets/portfolio/serverblue.png",
  services: "/assets/portfolio/serverblue.png",
  highlights: "/assets/portfolio/story-security.png",
  projects: "/assets/portfolio/netravax.png",
  "role-pages": "/assets/projects/site-network-browser.png",
  insights: "/assets/projects/site-blog-browser.png",
  contact: "/assets/portfolio/serverblue.png",
  catalog: "/assets/projects/site-security-browser.png",
  resume: "/assets/projects/hero-command.jpg",
  outro: "/assets/portfolio/serverblue.png"
};

const tileLinks = {
  services: "/services",
  highlights: "/highlights",
  projects: "/featured-projects",
  "role-pages": "/role-pages",
  insights: "/insights",
  contact: "/contact",
  catalog: "/catalog",
  resume: profile.links.resume
};

const getSectionRoute = (threeDContent, scene) => {
  if (scene === "resume") return threeDContent.profile?.links?.resume ?? profile.links.resume;
  return threeDContent.sections?.find((section) => section.id === scene)?.path ?? tileLinks[scene];
};

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

function tileOffsetFor(scene, compact) {
  const x = compact ? 1.18 : 3.55;
  const z = compact ? 1.72 : 1.95;
  const offsets = {
    hero: [0, 0, 0],
    services: [x, 0.04, z],
    highlights: [-x, -0.02, z],
    projects: [x, 0.02, z],
    "role-pages": [-x, 0.02, z],
    insights: [x, 0.02, z],
    contact: [-x, compact ? -0.02 : -0.04, z],
    catalog: [x, 0.02, z],
    resume: [-x, 0, z],
    outro: [0, 0, 0]
  };

  return offsets[scene] ?? [0, 0, 0.12];
}

function connectorPointFor(position, compact, content) {
  const side = position.x >= 0 ? -1 : 1;
  const { width, scale } = getTileMetrics({ compact, ...content });
  const edgeDistance = (width * scale) / 2 - (compact ? 0.06 : 0.1);
  return position.clone().add(new THREE.Vector3(side * edgeDistance, compact ? -0.04 : -0.06, 0.16));
}

function CameraRig({ activeScene, compact, curve, scrollProgress }) {
  const desired = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, pointer }, delta) => {
    const activeStop = SECTION_STOPS[activeScene] ?? scrollProgress;
    const travel = THREE.MathUtils.clamp(THREE.MathUtils.lerp(scrollProgress, activeStop, 0.2), 0.02, 0.966);
    const point = curve.getPointAt(travel);
    const lookPoint = curve.getPointAt(Math.min(0.99, travel + 0.05));
    const tilePoint = vectorFrom(getCurvePoint(curve, activeScene), tileOffsetFor(activeScene, compact));
    const side = tileOffsetFor(activeScene, compact)[0] >= 0 ? 1 : -1;

    if (activeScene === "hero") {
      desired.set(pointer.x * (compact ? 0.1 : 0.2), 0.5 + pointer.y * 0.14, compact ? 9.4 : 10.25);
      look.set(0, 0.1, 5.76);
    } else if (activeScene === "outro") {
      const outroPoint = getCurvePoint(curve, "outro");
      desired.set(pointer.x * (compact ? 0.1 : 0.18), outroPoint.y + 0.5 + pointer.y * 0.14, outroPoint.z + (compact ? 5.6 : 6.4));
      look.copy(outroPoint).add(new THREE.Vector3(0, compact ? 0.3 : 0.42, 0.65));
    } else {
      if (compact) {
        desired.set(tilePoint.x * 0.53 + pointer.x * 0.07, point.y + 0.42 + pointer.y * 0.07, point.z + 7.05);
        look.copy(tilePoint).add(new THREE.Vector3(0, 0.04, 0));
      } else {
        desired.set(point.x + side * 1.05 + pointer.x * 0.22, point.y + 0.62 + pointer.y * 0.22, point.z + 5.75);
        look.copy(lookPoint).lerp(tilePoint, 0.54);
      }
    }
    look.y += compact ? 0.1 : 0.16;

    const ease = 1 - Math.pow(0.001, delta);
    camera.position.lerp(desired, ease * 0.14);
    camera.lookAt(look);
    camera.fov = THREE.MathUtils.lerp(camera.fov, activeScene === "hero" ? (compact ? 50 : 42) : compact ? 47 : 42, 0.04);
    camera.updateProjectionMatrix();
  });

  return null;
}

function BranchCable({ active, color = COLORS.cyan, curve, fromT, to, visible = true }) {
  const coreRef = useRef(null);
  const glowRef = useRef(null);
  const endpointRef = useRef(null);
  const packetRefs = useRef([]);
  const branchCurve = useMemo(() => {
    const start = curve.getPointAt(fromT);
    const end = to.clone();
    const side = end.x >= start.x ? 1 : -1;
    const midA = start.clone().add(new THREE.Vector3(side * 0.42, 0.03, 0.22));
    const midB = end.clone().add(new THREE.Vector3(-side * 0.34, 0.08, -0.18));
    return new THREE.CatmullRomCurve3([start, midA, midB, end]);
  }, [curve, fromT, to]);

  useFrame(({ clock }) => {
    const signal = active ? 1 : 0;
    const pulse = signal * (0.07 + Math.sin(clock.elapsedTime * 4 + fromT * 10) * 0.025);
    if (coreRef.current) {
      coreRef.current.material.opacity = THREE.MathUtils.lerp(coreRef.current.material.opacity, visible ? (active ? 0.58 : 0.08) : 0, 0.08);
      coreRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(coreRef.current.material.emissiveIntensity, active ? 0.84 : 0.12, 0.08);
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, visible ? (active ? 0.22 + pulse : 0.025) : 0, 0.08);
    }
    if (endpointRef.current) {
      endpointRef.current.material.opacity = THREE.MathUtils.lerp(endpointRef.current.material.opacity, visible ? (active ? 0.34 + pulse : 0.05) : 0, 0.08);
      endpointRef.current.scale.setScalar(THREE.MathUtils.lerp(endpointRef.current.scale.x, active ? 1.12 + pulse : 0.72, 0.08));
    }
    packetRefs.current.forEach((packet, index) => {
      if (!packet) return;
      const t = (clock.elapsedTime * 0.42 + index * 0.28 + fromT) % 1;
      const point = branchCurve.getPointAt(t);
      packet.position.copy(point);
      packet.material.opacity = THREE.MathUtils.lerp(packet.material.opacity, visible && active ? 0.75 * (0.4 + t) : 0, 0.12);
      packet.scale.setScalar(THREE.MathUtils.lerp(packet.scale.x, active ? 0.7 + t * 0.5 : 0.2, 0.12));
    });
  });

  return (
    <>
      <mesh ref={glowRef}>
        <tubeGeometry args={[branchCurve, 42, 0.038, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={coreRef}>
        <tubeGeometry args={[branchCurve, 42, 0.012, 8, false]} />
        <meshStandardMaterial color="#061113" emissive={color} emissiveIntensity={0.2} metalness={0.5} opacity={0} roughness={0.22} transparent />
      </mesh>
      <mesh ref={endpointRef} position={to}>
        <boxGeometry args={[0.2, 0.075, 0.038]} />
        <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          ref={(node) => {
            if (node) packetRefs.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.035 + index * 0.004, 12, 12]} />
          <meshBasicMaterial color={index === 1 ? "#ffffff" : color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function ScrollReactiveBackground({ activeScene, compact, scrollProgress }) {
  const groupRef = useRef(null);
  const lineGeometry = useMemo(() => {
    const positions = [];
    const nodes = [];
    const depth = compact ? 19 : 31;
    const nodeCount = compact ? 22 : 42;

    for (let index = 0; index < nodeCount; index += 1) {
      const t = index / Math.max(1, nodeCount - 1);
      const side = index % 2 === 0 ? -1 : 1;
      const lane = Math.floor(index / 2) % 4;
      nodes.push(
        new THREE.Vector3(
          side * (compact ? 1.68 : 3.15) + Math.sin(index * 1.73) * (compact ? 0.34 : 0.9),
          Math.sin(index * 0.91) * (compact ? 1.05 : 1.8) + (0.5 - t) * (compact ? 1.05 : 1.8),
          6.6 - t * depth - lane * 0.18
        )
      );
    }

    nodes.forEach((node, index) => {
      const next = nodes[index + 2];
      const skip = nodes[index + 6];
      if (next) positions.push(node.x, node.y, node.z, next.x, next.y, next.z);
      if (skip && index % 3 === 0) positions.push(node.x, node.y, node.z, skip.x, skip.y, skip.z);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [compact]);
  const pointsGeometry = useMemo(() => {
    const positions = [];
    const depth = compact ? 19 : 31;
    const nodeCount = compact ? 22 : 42;

    for (let index = 0; index < nodeCount; index += 1) {
      const t = index / Math.max(1, nodeCount - 1);
      const side = index % 2 === 0 ? -1 : 1;
      const lane = Math.floor(index / 2) % 4;
      positions.push(
        side * (compact ? 1.68 : 3.15) + Math.sin(index * 1.73) * (compact ? 0.34 : 0.9),
        Math.sin(index * 0.91) * (compact ? 1.05 : 1.8) + (0.5 - t) * (compact ? 1.05 : 1.8),
        6.6 - t * depth - lane * 0.18
      );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [compact]);
  const routeGeometry = useMemo(() => {
    const positions = [];
    const width = compact ? 5.1 : 8.8;
    const height = compact ? 2.35 : 3.8;
    const depth = compact ? 20 : 34;
    const rows = compact ? 4 : 7;
    const cols = compact ? 4 : 7;

    for (let row = 0; row < rows; row += 1) {
      const t = row / Math.max(1, rows - 1);
      const y = -height / 2 + t * height + Math.sin(row * 1.7) * 0.08;
      const z = 5.5 - t * depth;
      positions.push(-width / 2, y, z, width / 2, y, z - 0.8);
    }

    for (let col = 0; col < cols; col += 1) {
      const t = col / Math.max(1, cols - 1);
      const x = -width / 2 + t * width;
      const z = 5.2 - t * depth * 0.75;
      positions.push(x, -height / 2, z, x + Math.sin(col) * 0.4, height / 2, z - 5.2);
    }

    for (let index = 0; index < rows - 1; index += 1) {
      const z = 4.8 - index * (depth / rows);
      positions.push(-width / 2, -height / 2 + index * 0.52, z, -width / 6, 0.2, z - 1.4);
      positions.push(width / 6, -0.18, z - 0.6, width / 2, height / 2 - index * 0.42, z - 2.2);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [compact]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const section = getSceneIndex(activeScene);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (scrollProgress - 0.5) * 0.18, 0.035);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, Math.sin(scrollProgress * Math.PI * 2) * 0.28, 0.04);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -scrollProgress * 1.2, 0.04);
    groupRef.current.children.forEach((child, index) => {
      if (child.material) {
        const outroFade = activeScene === "outro" ? 0.22 : 1;
        child.material.opacity = outroFade * (0.055 + Math.sin(clock.elapsedTime * 0.8 + section + index) * 0.018);
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -1.2]}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={sectionColors[activeScene] ?? COLORS.cyan} transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <lineSegments geometry={routeGeometry} position={[0, compact ? 0.2 : 0.38, -0.85]}>
        <lineBasicMaterial color={sectionColors[activeScene] ?? COLORS.cyan} transparent opacity={0.045} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <points geometry={pointsGeometry}>
        <pointsMaterial
          color="#7af8ff"
          size={compact ? 0.035 : 0.05}
          sizeAttenuation
          transparent
          opacity={0.09}
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
          rotation={[index * 0.44, index * 0.22, 0]}
        >
          <torusGeometry args={[compact ? 0.28 + index * 0.09 : 0.36 + index * 0.12, 0.006, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
      <pointLight color={color} distance={compact ? 2.4 : 3.4} intensity={0} ref={lightRef} />
    </group>
  );
}

function estimateTileLines(textItems, compact) {
  const wrapAt = compact ? 28 : 46;
  return textItems.reduce((total, item) => total + Math.max(1, Math.ceil(String(item ?? "").length / wrapAt)), 0);
}

function readTypographyScale(value, fallback, min, max) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? THREE.MathUtils.clamp(numeric, min, max) : fallback;
}

function getTileTypography(typography = {}) {
  return {
    titleScale: readTypographyScale(typography.titleScale, 1, 0.75, 1.45),
    bodyScale: readTypographyScale(typography.bodyScale, 1, 0.75, 1.55),
    kickerScale: readTypographyScale(typography.kickerScale, 1, 0.75, 1.3),
    lineHeightScale: readTypographyScale(typography.lineHeightScale, 1, 0.9, 1.25)
  };
}

function getTileMetrics({ body, compact, lines = [], scene, title, typography }) {
  const isHero = scene === "hero";
  const { bodyScale } = getTileTypography(typography);
  const safeTitle = String(title ?? "");
  const longTitle = safeTitle.length > 48 || safeTitle.includes("\n");
  const estimatedLines = estimateTileLines([body, ...lines], compact);
  const dense = estimatedLines > (compact ? 8 : 9);
  const heightScale = Math.max(0, bodyScale - 1) * (compact ? 0.16 : 0.26);

  return {
    dense,
    height: compact ? (dense ? 2.96 : 2.24) + heightScale : isHero ? 2.04 : (dense ? 3.18 : 2.5) + heightScale,
    longTitle,
    scale: isHero ? 0.96 : compact ? 0.9 : 1.14,
    width: compact ? (dense ? 3.2 : 2.9) : isHero ? 3.4 : dense ? 4.74 : 4.02
  };
}

function ContentTile3D({ active, body, color, compact, href, icon, image, kicker, lines = [], navigate, position, scene, side = 1, title, typography }) {
  const groupRef = useRef(null);
  const panelRef = useRef(null);
  const glowRef = useRef(null);
  const isHero = scene === "hero";
  const { bodyScale, kickerScale, lineHeightScale, titleScale } = getTileTypography(typography);
  const { dense, height, longTitle, scale: activeScale, width } = getTileMetrics({ body, compact, lines, scene, title, typography });
  const titleSize = (compact ? (longTitle ? 0.112 : 0.145) : isHero ? 0.17 : longTitle ? 0.158 : dense ? 0.205 : 0.235) * titleScale;
  const bodySize = (compact ? (dense ? 0.064 : 0.071) : dense ? 0.096 : 0.102) * bodyScale;
  const bodyLineHeight = (compact ? 1.2 : 1.18) * lineHeightScale;
  const kickerSize = (compact ? 0.074 : isHero ? 0.078 : dense ? 0.078 : 0.09) * kickerScale;
  const bodyOffset = compact ? (dense ? 1.08 : longTitle ? 1.08 : 1) : dense ? 1.08 : longTitle ? 1.22 : 1.04;
  const bodyText = [body, ...lines].filter(Boolean).join("\n");
  const portX = position.x >= 0 ? -width / 2 + 0.08 : width / 2 - 0.08;
  const hasIcon = Boolean(icon);
  const logoReserve = hasIcon ? (compact ? 0.68 : 0.88) : 0;
  const titleTop = height / 2 - (compact ? 0.36 : 0.42);
  const bodyX = -width / 2 + 0.24;
  const bodyMaxWidth = width - (compact ? 0.78 : 0.86);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const targetScale = active ? activeScale : 0.52;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.07));
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      side * (active ? -0.12 : -0.2) + pointer.x * 0.035,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * -0.025, 0.05);
    groupRef.current.position.y = position.y + Math.sin(clock.elapsedTime * 1.1 + position.x) * 0.015;

    if (panelRef.current) {
      panelRef.current.material.opacity = THREE.MathUtils.lerp(panelRef.current.material.opacity, active ? 0.86 : 0.3, 0.08);
      panelRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(panelRef.current.material.emissiveIntensity, active ? 0.24 : 0.08, 0.08);
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, active ? 0.18 : 0.04, 0.08);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        if (!href) return;
        if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
          window.location.href = href;
          return;
        }
        navigate(href);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = href ? "pointer" : "";
      }}
    >
      <RoundedBox ref={panelRef} args={[width, height, 0.07]} radius={0.055} smoothness={6}>
        <meshPhysicalMaterial
          clearcoat={0.8}
          color="#061014"
          emissive={color}
          emissiveIntensity={0.1}
          metalness={0.2}
          opacity={0.55}
          roughness={0.28}
          transparent
        />
      </RoundedBox>
      <RoundedBox ref={glowRef} args={[width + 0.08, height + 0.08, 0.028]} position={[0, 0, -0.05]} radius={0.08} smoothness={6}>
        <meshBasicMaterial color={color} transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
      </RoundedBox>
      <TilePhotoLayer active={active} height={height} image={image} width={width} />
      <TileReadabilityLayer active={active} height={height} width={width} />
      {hasIcon ? <TileLogoLayer active={active} color={color} compact={compact} icon={icon} titleTop={titleTop} width={width} /> : null}
      <TileSignalRail active={active} color={color} compact={compact} height={height} lineCount={lines.length} width={width} />
      <mesh position={[portX, compact ? -0.04 : -0.06, 0.115]} renderOrder={7}>
        <boxGeometry args={[0.18, 0.072, 0.042]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.62 : 0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
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
        fontSize={bodySize}
        lineHeight={bodyLineHeight}
        material-depthTest={false}
        maxWidth={bodyMaxWidth}
        position={[bodyX, height / 2 - bodyOffset, 0.07]}
        renderOrder={6}
      >
        {bodyText}
      </Text>
      {href ? (
        <Text
          anchorX="right"
          anchorY="bottom"
          color={color}
          fontSize={compact ? 0.052 : 0.068}
          material-depthTest={false}
          position={[width / 2 - 0.18, -height / 2 + 0.16, 0.08]}
          renderOrder={6}
        >
          {scene === "resume" ? "OPEN CV" : "OPEN SECTION"}
        </Text>
      ) : null}
    </group>
  );
}

function makeTileContent(threeDContent) {
  return threeDContent.tiles ?? defaultThreeDContent.tiles;
}

function RunwayTiles({ activeScene, compact, curve, navigate, threeDContent }) {
  const tileContent = useMemo(() => makeTileContent(threeDContent), [threeDContent]);
  const positions = useMemo(() => {
    return Object.fromEntries(sceneOrder.map((scene) => [scene, vectorFrom(getCurvePoint(curve, scene), tileOffsetFor(scene, compact))]));
  }, [compact, curve]);

  return (
    <group>
      {sceneOrder.map((scene) => {
        if (scene === "hero" || scene === "outro") return null;
        const active = activeScene === scene;
        const visible = active;
        const content = tileContent[scene] ?? defaultThreeDContent.tiles[scene];
        if (!content) return null;
        const color = sectionColors[scene] ?? COLORS.mint;
        const href = getSectionRoute(threeDContent, scene);
        const image = content.image || defaultTileImages[scene];

        return (
          <group key={scene} visible={visible}>
            {scene !== "hero" ? (
              <BranchCable
                active={active}
                color={color}
                curve={curve}
                fromT={SECTION_STOPS[scene]}
                to={connectorPointFor(positions[scene], compact, { ...content, scene })}
                visible={visible}
              />
            ) : null}
            <ContentTile3D
              active={active}
              body={content.body}
              color={color}
              compact={compact}
              href={href}
              icon={content.icon}
              kicker={content.kicker}
              lines={content.lines}
              image={image}
              navigate={navigate}
              position={positions[scene]}
              scene={scene}
              side={sceneOrder.indexOf(scene) % 2 === 0 ? 1 : -1}
              title={content.title}
              typography={content.typography}
            />
          </group>
        );
      })}
    </group>
  );
}

function ContactOutroS({ activeScene, compact, curve, scrollProgress }) {
  const active = activeScene === "outro";
  const point = useMemo(() => vectorFrom(getCurvePoint(curve, "outro"), [0, compact ? 0.56 : 0.72, 0.54]), [compact, curve]);

  if (activeScene !== "contact" && activeScene !== "outro") return null;

  return <SMark3D active={active} compact={compact} position={point} scale={active ? (compact ? 0.96 : 1.18) : compact ? 0.42 : 0.5} scrollProgress={scrollProgress} />;
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
  const heroSPoint = useMemo(() => new THREE.Vector3(0, compact ? 0.76 : 0.82, 5.72), [compact]);
  const showHeroS = activeScene === "hero";
  const heroSScale = activeScene === "hero" ? (compact ? 0.82 : 1.16) : compact ? 0.34 : 0.42;

  return (
    <>
      <color attach="background" args={["#020305"]} />
      <fog attach="fog" args={["#020305", compact ? 5 : 6.5, compact ? 25 : 36]} />
      <CameraRig activeScene={activeScene} compact={compact} curve={curve} scrollProgress={scrollProgress} />
      <SceneLights activeScene={activeScene} curve={curve} />
      <ScrollReactiveBackground activeScene={activeScene} compact={compact} scrollProgress={scrollProgress} />
      {showHeroS ? <SMark3D active={activeScene === "hero"} compact={compact} position={heroSPoint} scale={heroSScale} scrollProgress={scrollProgress} /> : null}
      <FibreCable activeScene={activeScene} curve={curve} scrollProgress={scrollProgress} />
      <SectionGate activeScene={activeScene} compact={compact} curve={curve} scrollProgress={scrollProgress} />
      <PacketLights count={compact ? 3 : 6} curve={curve} scrollProgress={scrollProgress} />
      <RunwayTiles activeScene={activeScene} compact={compact} curve={curve} navigate={navigate} threeDContent={threeDContent} />
      <ContactOutroS activeScene={activeScene} compact={compact} curve={curve} scrollProgress={scrollProgress} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={compact ? 0.24 : 0.36} luminanceThreshold={0.16} mipmapBlur radius={compact ? 0.24 : 0.34} />
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
      camera={{ position: [0, 1.2, compact ? 11.2 : 13], fov: compact ? 50 : 48, near: 0.1, far: 90 }}
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
