import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function PacketLights({ count = 14, curve, scrollProgress }) {
  const refs = useRef([]);
  const lightRefs = useRef([]);

  useFrame(({ clock }) => {
    const ending = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.9, 0.985);
    const presence = THREE.MathUtils.smoothstep(scrollProgress, 0.075, 0.2) * ending;
    const reveal = THREE.MathUtils.clamp((scrollProgress - 0.03) * 1.12, 0.001, 1);
    refs.current.forEach((packet, index) => {
      if (!packet) return;
      const t = (scrollProgress * 0.18 + clock.elapsedTime * 0.035 + index / count) % reveal;
      const position = curve.getPointAt(t);
      packet.position.copy(position);
      packet.scale.setScalar(0.55 + Math.sin(t * Math.PI) * 0.42);
      packet.material.opacity = presence * (0.22 + Math.sin(t * Math.PI) * 0.5);

      const light = lightRefs.current[index];
      if (light) {
        light.position.copy(position);
        light.intensity = presence * (0.2 + Math.sin(t * Math.PI) * 0.65);
      }
    });
  });

  return (
    <group>
      {Array.from({ length: count }, (_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            if (node) refs.current[index] = node;
          }}
        >
          <octahedronGeometry args={[index % 4 === 0 ? 0.1 : 0.068, 0]} />
          <meshBasicMaterial
            color={index % 5 === 0 ? "#f4c86a" : index % 3 === 0 ? "#b99cff" : "#76ffbf"}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
          {index < 5 ? (
            <pointLight
              color={index % 2 === 0 ? "#76ffbf" : "#7af8ff"}
              distance={2.4}
              intensity={0.4}
              ref={(node) => {
                if (node) lightRefs.current[index] = node;
              }}
            />
          ) : null}
        </mesh>
      ))}
    </group>
  );
}
