import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const networkNodes = [
  [0, 18, 1.06],
  [4, 7, 0.72],
  [7, 42, 0.78],
  [0, 70, 0.92],
  [13, 92, 0.72],
  [19, 14, 0.78],
  [17, 28, 0.66],
  [25, 36, 1.18],
  [18, 61, 0.74],
  [23, 74, 0.68],
  [31, 82, 1.02],
  [40, 5, 0.66],
  [36, 22, 0.76],
  [46, 27, 0.92],
  [38, 54, 0.74],
  [45, 69, 0.64],
  [51, 73, 0.82],
  [58, 94, 1.1],
  [66, 17, 0.72],
  [60, 7, 0.6],
  [72, 36, 0.64],
  [63, 62, 0.78],
  [78, 54, 0.56],
  [70, 83, 0.66],
  [83, 92, 0.7],
  [90, 12, 0.92],
  [86, 25, 0.62],
  [98, 31, 0.68],
  [88, 48, 0.56],
  [92, 70, 0.74],
  [102, 89, 1],
  [111, 5, 0.72],
  [106, 19, 0.62],
  [119, 26, 1.12],
  [110, 51, 0.72],
  [118, 61, 0.66],
  [123, 69, 0.84],
  [118, 94, 0.68],
  [134, 14, 0.84],
  [128, 2, 0.58],
  [142, 37, 0.74],
  [132, 57, 1.08],
  [139, 69, 0.62],
  [146, 80, 0.7],
  [158, 22, 0.88],
  [153, 8, 0.64],
  [160, 51, 0.78],
  [151, 63, 0.58],
  [155, 93, 0.98]
];

function seededNoise(index, seed) {
  return Math.sin(index * 91.7 + seed * 17.13) * 0.5 + 0.5;
}

function createNetworkLinks(nodes, seed = 0) {
  const links = [];
  const linkKeys = new Set();
  const addLink = (from, to, distance) => {
    const key = from < to ? `${from}-${to}` : `${to}-${from}`;

    if (linkKeys.has(key)) return;

    linkKeys.add(key);
    links.push([from, to, distance]);
  };

  nodes.forEach(([x1, y1], from) => {
    if (from < nodes.length - 1) {
      addLink(from, from + 1, 0);
    }

    nodes.slice(from + 1).forEach(([x2, y2], offset) => {
      const to = from + offset + 1;
      const distance = Math.hypot(x1 - x2, y1 - y2);

      if (distance < 42) {
        addLink(from, to, distance);
      }
    });
  });

  return links
    .map((link, index) => [...link, link[2] - seededNoise(index, seed) * 12])
    .sort((a, b) => a[3] - b[3])
    .slice(0, 136)
    .map(([from, to]) => [from, to]);
}

function LogoNetworkBackdrop({ cursor }) {
  const [linkSeed, setLinkSeed] = useState(0);
  const networkLinks = useMemo(() => createNetworkLinks(networkNodes, linkSeed), [linkSeed]);
  const cursorLinks = useMemo(() => {
    if (!cursor.active) return [];

    return networkNodes
      .map(([x, y], index) => ({
        distance: Math.hypot(x - cursor.x, y - cursor.y),
        index
      }))
      .filter(({ distance }) => distance < 43)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8);
  }, [cursor]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const intervalId = window.setInterval(() => {
      setLinkSeed((current) => current + 1);
    }, 540);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <svg className="logo-intro__network" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <filter id="logo-network-glow" x="-18%" y="-18%" width="136%" height="136%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g className="logo-intro__network-lines logo-intro__network-lines--glow" filter="url(#logo-network-glow)">
        {networkLinks.map(([from, to], index) => {
          const [x1, y1] = networkNodes[from];
          const [x2, y2] = networkNodes[to];

          return <line key={`glow-${from}-${to}`} x1={x1} y1={y1} x2={x2} y2={y2} style={{ "--line-index": index }} />;
        })}
      </g>
      <g className="logo-intro__network-lines logo-intro__network-lines--core">
        {networkLinks.map(([from, to], index) => {
          const [x1, y1] = networkNodes[from];
          const [x2, y2] = networkNodes[to];

          return <line key={`${from}-${to}`} x1={x1} y1={y1} x2={x2} y2={y2} style={{ "--line-index": index }} />;
        })}
      </g>
      <g className="logo-intro__network-lines logo-intro__network-lines--cursor" filter="url(#logo-network-glow)">
        {cursorLinks.map(({ index, distance }) => {
          const [x2, y2] = networkNodes[index];
          const cursorStrength = Math.max(0, 1 - distance / 43);

          return (
            <line
              key={`cursor-${index}`}
              x1={cursor.x}
              y1={cursor.y}
              x2={x2}
              y2={y2}
              style={{ "--cursor-strength": cursorStrength }}
            />
          );
        })}
      </g>
      <g className="logo-intro__network-dots logo-intro__network-dots--glow" filter="url(#logo-network-glow)">
        {networkNodes.map(([cx, cy, radius], index) => {
          const cursorBoost = cursor.active ? Math.max(0, 1 - Math.hypot(cx - cursor.x, cy - cursor.y) / 35) : 0;

          return (
            <circle
              cx={cx}
              cy={cy}
              key={`glow-${cx}-${cy}`}
              r={radius * (2.3 + cursorBoost * 1.45)}
              style={{ "--cursor-boost": cursorBoost, "--dot-index": index }}
            />
          );
        })}
      </g>
      <g className="logo-intro__network-dots">
        {networkNodes.map(([cx, cy, radius], index) => {
          const cursorBoost = cursor.active ? Math.max(0, 1 - Math.hypot(cx - cursor.x, cy - cursor.y) / 35) : 0;

          return (
            <circle
              cx={cx}
              cy={cy}
              key={`${cx}-${cy}`}
              r={radius * (1 + cursorBoost * 0.72)}
              style={{ "--cursor-boost": cursorBoost, "--dot-index": index }}
            />
          );
        })}
      </g>
    </svg>
  );
}

export function LogoIntro({ onComplete }) {
  const rootRef = useRef(null);
  const rafRef = useRef(0);
  const [cursor, setCursor] = useState({ active: false, x: 80, y: 50 });

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(onComplete, reduceMotion ? 700 : 2450);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const handlePointerMove = (event) => {
      const rect = root.getBoundingClientRect();
      const nextCursor = {
        active: true,
        x: Math.max(0, Math.min(160, ((event.clientX - rect.left) / rect.width) * 160)),
        y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100))
      };

      root.style.setProperty("--network-cursor-x", `${event.clientX}px`);
      root.style.setProperty("--network-cursor-y", `${event.clientY}px`);
      root.style.setProperty("--network-cursor-opacity", "1");

      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(() => {
          setCursor(nextCursor);
          rafRef.current = 0;
        });
      }
    };
    const handlePointerLeave = () => {
      root.style.setProperty("--network-cursor-opacity", "0");
      setCursor((current) => ({ ...current, active: false }));
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <motion.div
      ref={rootRef}
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
      <LogoNetworkBackdrop cursor={cursor} />
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
