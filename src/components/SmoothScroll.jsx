import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    // Touch/coarse-pointer devices already have good native momentum
    // scroll; wrapping it in Lenis only adds JS overhead there for no
    // benefit, so it's scoped to desktop wheel-scroll same as reduced
    // motion. Nav's scene-click handler falls back to native scrollTo
    // when window.__portfolioLenis is absent, so this is a safe no-op
    // change on touch, not a behavioural regression.
    if (reduceMotion || isCoarsePointer) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.18,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.1
    });
    window.__portfolioLenis = lenis;

    let frameId;
    const raf = (time) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      if (window.__portfolioLenis === lenis) {
        delete window.__portfolioLenis;
      }
      lenis.destroy();
    };
  }, []);

  return null;
}
