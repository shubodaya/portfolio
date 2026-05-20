import { Center, Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import helvetikerBold from "three/examples/fonts/helvetiker_bold.typeface.json";

export function SMark3D({ active = false, compact = false, position = [0, 0, 0], scale = 1, scrollProgress = 0 }) {
  const groupRef = useRef(null);

  useFrame(({ clock, pointer }) => {
    const elapsed = clock.elapsedTime;
    const baseY = Array.isArray(position) ? position[1] : position.y ?? 0;
    if (groupRef.current) {
      const targetScale = scale * (active ? 1 : 0.86);
      const horizontalYaw = Math.sin(elapsed * 0.42 + scrollProgress * 1.1) * 0.24 + pointer.x * 0.1;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.06));
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.035, 0.035);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, horizontalYaw, 0.055);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.06);
      groupRef.current.position.y = baseY + Math.sin(elapsed * 1.1) * 0.025;
    }
  });

  return (
    <group ref={groupRef} position={position}>
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
            transparent
            opacity={active ? 0.2 : 0.12}
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
            emissiveIntensity={active ? 0.34 : 0.16}
            metalness={0.86}
            reflectivity={0.66}
            roughness={0.18}
          />
        </Text3D>
      </Center>
      <pointLight color="#76ffbf" distance={4.2} intensity={active ? 1.7 : 0.8} position={[0.7, 0.8, 1.4]} />
      <pointLight color="#7af8ff" distance={5} intensity={active ? 1.2 : 0.5} position={[-1.2, -0.4, 1.8]} />
    </group>
  );
}
