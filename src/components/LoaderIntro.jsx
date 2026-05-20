import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SMark3D } from "./SMark3D.jsx";

export function LoaderIntro({ onComplete }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(onComplete, reduceMotion ? 650 : 2400);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-label="Loading Shubodaya Kumar portfolio"
      className="loader-intro"
      exit={{
        opacity: 0,
        filter: "blur(10px)",
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
      }}
      initial={{ opacity: 1 }}
      role="status"
    >
      <div className="loader-grid" aria-hidden="true" />
      <div className="loader-webgl" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 5.2], fov: 40 }} dpr={[1, 1.45]} gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}>
          <color attach="background" args={["#000000"]} />
          <ambientLight intensity={0.42} />
          <directionalLight color="#e8fbff" intensity={0.9} position={[-2, 3, 4]} />
          <SMark3D active position={[0, 0.12, 0]} scale={1.02} />
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.42} luminanceThreshold={0.18} mipmapBlur radius={0.38} />
          </EffectComposer>
        </Canvas>
      </div>
      <motion.div
        aria-hidden="true"
        className="loader-dissolve"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 0], opacity: [0, 0.82, 0] }}
        transition={{ delay: 1.85, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="loader-copy"
        initial={{ opacity: 0, y: 14 }}
        transition={{ delay: 0.42, duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>FIREWALL / VPN / NETWORK SUPPORT</span>
        <strong>SHUBODAYA KUMAR / NETWORK SECURITY ENGINEER</strong>
      </motion.div>
    </motion.div>
  );
}
