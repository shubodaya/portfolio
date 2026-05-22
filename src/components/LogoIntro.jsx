import { motion } from "framer-motion";
import { useEffect } from "react";

const networkNodes = [
  [0, 18, 1.06],
  [7, 42, 0.78],
  [0, 70, 0.92],
  [13, 92, 0.72],
  [19, 14, 0.78],
  [25, 36, 1.18],
  [18, 61, 0.74],
  [31, 82, 1.02],
  [40, 5, 0.66],
  [46, 27, 0.92],
  [38, 54, 0.74],
  [51, 73, 0.82],
  [58, 94, 1.1],
  [66, 17, 0.72],
  [72, 36, 0.64],
  [63, 62, 0.78],
  [70, 83, 0.66],
  [90, 12, 0.92],
  [98, 31, 0.68],
  [92, 70, 0.74],
  [102, 89, 1],
  [111, 5, 0.72],
  [119, 26, 1.12],
  [110, 51, 0.72],
  [123, 69, 0.84],
  [118, 94, 0.68],
  [134, 14, 0.84],
  [142, 37, 0.74],
  [132, 57, 1.08],
  [146, 80, 0.7],
  [158, 22, 0.88],
  [160, 51, 0.78],
  [155, 93, 0.98]
];

function createNetworkLinks(nodes) {
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

      if (distance < 31) {
        addLink(from, to, distance);
      }
    });
  });

  return links
    .sort((a, b) => a[2] - b[2])
    .slice(0, 72)
    .map(([from, to]) => [from, to]);
}

const networkLinks = createNetworkLinks(networkNodes);

function LogoNetworkBackdrop() {
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
      <g className="logo-intro__network-dots logo-intro__network-dots--glow" filter="url(#logo-network-glow)">
        {networkNodes.map(([cx, cy, radius], index) => (
          <circle
            cx={cx}
            cy={cy}
            key={`glow-${cx}-${cy}`}
            r={radius * 2.3}
            style={{ "--dot-index": index }}
          />
        ))}
      </g>
      <g className="logo-intro__network-dots">
        {networkNodes.map(([cx, cy, radius], index) => (
          <circle
            cx={cx}
            cy={cy}
            key={`${cx}-${cy}`}
            r={radius}
            style={{ "--dot-index": index }}
          />
        ))}
      </g>
    </svg>
  );
}

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
      <LogoNetworkBackdrop />
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
