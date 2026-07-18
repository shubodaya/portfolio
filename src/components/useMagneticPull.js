import { useEffect, useRef } from "react";

const MAX_OFFSET = 10;
const STRENGTH = 0.35;

// Subtle magnetic pull for a single highest-value action — draws attention
// to it, not decoration applied broadly. Bound to the element's own hover
// bounds only (no wider capture radius) to keep the pull tightly scoped.
// Uses the standalone CSS `translate` property (not `transform`) so it
// composes with the element's existing CSS :hover/:focus-visible transform
// instead of overriding it. Off on touch/coarse pointer (no persistent
// cursor to follow) and under prefers-reduced-motion (continuous
// pointer-tracking motion is exactly what that preference exists to
// disable).
export function useMagneticPull() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || isCoarsePointer) return undefined;

    const handleMove = (event) => {
      const rect = node.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      const x = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, relX * STRENGTH));
      const y = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, relY * STRENGTH));
      node.style.translate = `${x}px ${y}px`;
    };

    const handleLeave = () => {
      node.style.translate = "";
    };

    node.addEventListener("mousemove", handleMove);
    node.addEventListener("mouseleave", handleLeave);

    return () => {
      node.removeEventListener("mousemove", handleMove);
      node.removeEventListener("mouseleave", handleLeave);
      node.style.translate = "";
    };
  }, []);

  return ref;
}
