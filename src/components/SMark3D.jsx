import { Center, Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import helvetikerBold from "three/examples/fonts/helvetiker_bold.typeface.json";

// Opacity is sampled per frame via getOpacity (a function of live scroll
// progress) and applied through material/light refs, so scroll fades never
// require a React re-render. `active` is discrete and may stay a plain prop.
export function SMark3D({
  active = false,
  activeScale,
  compact = false,
  getOpacity,
  href,
  inactiveScale,
  locked = false,
  navigate,
  position = [0, 0, 0],
  scale = 1
}) {
  const groupRef = useRef(null);
  const glowMaterialRef = useRef(null);
  const bodyMaterialRef = useRef(null);
  const keyLightRef = useRef(null);
  const fillLightRef = useRef(null);
  const opacityRef = useRef(0);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;

    const opacity = THREE.MathUtils.clamp(getOpacity ? getOpacity() : 1, 0, 1);
    opacityRef.current = opacity;
    groupRef.current.visible = opacity > 0.005;
    if (!groupRef.current.visible) return;

    const elapsed = clock.elapsedTime;
    const baseX = Array.isArray(position) ? position[0] : position.x ?? 0;
    const baseY = Array.isArray(position) ? position[1] : position.y ?? 0;
    const baseZ = Array.isArray(position) ? position[2] : position.z ?? 0;
    const baseScale = active ? activeScale ?? scale : inactiveScale ?? scale;
    const targetScale = baseScale * (active ? 1 : 0.86) * THREE.MathUtils.clamp(0.94 + opacity * 0.06, 0.01, 1);
    const logoHold = locked ? 0 : THREE.MathUtils.smoothstep(opacity, 0.08, 0.9);
    const horizontalYaw = (Math.sin(elapsed * 0.32) * 0.06 + pointer.x * 0.035) * logoHold;

    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.06));
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.018 * logoHold, 0.035);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, horizontalYaw, 0.055);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.06);
    if (locked) {
      groupRef.current.position.set(baseX, baseY, baseZ);
    } else {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, baseX, 0.18);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, baseY, 0.18);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, baseZ, 0.18);
    }

    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = (active ? 0.2 : 0.12) * opacity;
    }
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.opacity = opacity;
      bodyMaterialRef.current.emissiveIntensity = (active ? 0.34 : 0.16) * opacity;
    }
    if (keyLightRef.current) {
      keyLightRef.current.intensity = (active ? 1.7 : 0.8) * opacity;
    }
    if (fillLightRef.current) {
      fillLightRef.current.intensity = (active ? 1.2 : 0.5) * opacity;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(event) => {
        if (!href || opacityRef.current < 0.18) return;
        event.stopPropagation();
        if (href.startsWith("/") && navigate) {
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
        if (!href || opacityRef.current < 0.18) return;
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
    >
      <Center position={[0, -0.08, 0]}>
        <Text3D
          bevelEnabled
          bevelSegments={4}
          bevelSize={0.04}
          curveSegments={18}
          font={helvetikerBold}
          height={0.16}
          position={[0, 0, -0.04]}
          scale={[1.035, 1.035, 1]}
          size={compact ? 1.42 : 1.72}
        >
          S
          <meshBasicMaterial
            color="#76ffbf"
            ref={glowMaterialRef}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </Text3D>
        <Text3D
          bevelEnabled
          bevelSegments={6}
          bevelSize={0.035}
          curveSegments={18}
          font={helvetikerBold}
          height={0.22}
          size={compact ? 1.42 : 1.72}
        >
          S
          <meshPhysicalMaterial
            clearcoat={1}
            clearcoatRoughness={0.16}
            color="#1b2221"
            emissive="#0fb78e"
            emissiveIntensity={0}
            metalness={0.86}
            opacity={0}
            reflectivity={0.66}
            ref={bodyMaterialRef}
            roughness={0.18}
            transparent
          />
        </Text3D>
      </Center>
      <pointLight color="#76ffbf" distance={4.2} intensity={0} position={[0.7, 0.8, 1.4]} ref={keyLightRef} />
      <pointLight color="#7af8ff" distance={5} intensity={0} position={[-1.2, -0.4, 1.8]} ref={fillLightRef} />
    </group>
  );
}
