import { motion } from "framer-motion";
import { useEffect } from "react";
import { JourneyNetworkBackdrop } from "./JourneyNetworkBackdrop.jsx";

export function LogoIntro({ onComplete }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(onComplete, reduceMotion ? 700 : 2450);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      aria-label="Loading Shubodaya Kumar portfolio"
      className="logo-intro"
      exit={{
        clipPath: "inset(0 0 0 100%)",
        transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
      }}
      initial={{ clipPath: "inset(0 0 0 0)" }}
      role="status"
    >
      <div className="logo-intro__grid" aria-hidden="true" />
      <JourneyNetworkBackdrop className="logo-intro__network" density={1} opacity={0.66} />
      <motion.div
        className="logo-intro__mark"
        initial={{ opacity: 0, scale: 0.84, rotate: -6 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.84, 1, 1.04, 0.82], rotate: [-6, 0, 0, 5] }}
        transition={{ duration: 2.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src="/assets/s-logo.png" alt="" />
      </motion.div>
      <motion.div
        className="logo-intro__blade"
        initial={{ opacity: 0, y: "-62vh", rotate: -3.5 }}
        animate={{ opacity: [0, 0, 1, 0.68, 0], y: ["-62vh", "-62vh", "-8vh", "30vh", "62vh"], rotate: -3.5 }}
        transition={{ delay: 1.16, duration: 1.08, ease: [0.76, 0, 0.24, 1] }}
        aria-hidden="true"
      />
    </motion.div>
  );
}
