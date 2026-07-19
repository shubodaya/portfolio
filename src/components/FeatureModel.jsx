import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// A real, imported GLTF model (as opposed to every other object in this scene,
// which is procedural Three.js geometry) floating near a section of the fibre
// journey. Deliberately keeps the model's own authored materials/textures
// untouched — safer than rewriting an unknown material graph per-model — and
// ties it into the scene's neon language with a colored point light instead.
// Presence/scale is driven by the same tile-activation value ContentTile3D
// uses, so it reveals and recedes in step with its section.
export function FeatureModel({ activation = 0, color = "#76ffbf", modelPath, position, scale = 1, spinSpeed = 0.22 }) {
  const { scene: modelScene } = useGLTF(modelPath);
  // Community-sourced GLTFs are authored at wildly inconsistent native scales
  // and pivots (checked: one of these ships at ~950-unit size centered ~1400
  // units from its own origin). Normalizing to a unit bounding box centered at
  // local origin means the `scale`/`position` props below behave consistently
  // regardless of whatever units the source file used.
  const model = useMemo(() => {
    const clone = modelScene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    clone.position.sub(center);
    // A light emissive lift on whatever material the source model shipped
    // with (not a replacement) — otherwise these community models render
    // near-black against this scene's mostly-dark, mostly-distant lighting.
    clone.traverse((node) => {
      if (node.isMesh && node.material && "emissiveIntensity" in node.material) {
        node.material = node.material.clone();
        if (!node.material.emissive || node.material.emissive.getHex() === 0) {
          node.material.emissive = new THREE.Color(color);
        }
        node.material.emissiveIntensity = Math.max(node.material.emissiveIntensity, 0.22);
      }
    });
    const wrapper = new THREE.Group();
    wrapper.add(clone);
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    wrapper.scale.setScalar(1 / maxDimension);
    return wrapper;
  }, [color, modelScene]);
  const groupRef = useRef(null);
  const keyLightRef = useRef(null);
  const fillLightRef = useRef(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const presence = THREE.MathUtils.clamp(activation, 0, 1);
    const target = presence * scale;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.1));
    groupRef.current.rotation.y = clock.elapsedTime * spinSpeed;
    groupRef.current.position.y = position.y + Math.sin(clock.elapsedTime * 0.6) * 0.12;
    if (keyLightRef.current) {
      keyLightRef.current.intensity = THREE.MathUtils.lerp(keyLightRef.current.intensity, presence * 4.2, 0.1);
    }
    if (fillLightRef.current) {
      fillLightRef.current.intensity = THREE.MathUtils.lerp(fillLightRef.current.intensity, presence * 2.2, 0.1);
    }
  });

  return (
    <group position={position} ref={groupRef} scale={0.0001}>
      <primitive object={model} />
      <pointLight color={color} distance={5} intensity={0} position={[0.6, 0.7, 0.9]} ref={keyLightRef} />
      <pointLight color="#f4fbff" distance={5} intensity={0} position={[-0.7, -0.3, 0.6]} ref={fillLightRef} />
    </group>
  );
}

useGLTF.preload("/models/laptop.glb");
useGLTF.preload("/models/padlock.glb");
