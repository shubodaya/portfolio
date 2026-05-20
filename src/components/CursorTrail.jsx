import { useEffect, useRef, useState } from "react";

const MAX_PACKETS = 18;

export function CursorTrail() {
  const [packets, setPackets] = useState([]);
  const idRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      return undefined;
    }

    const addPacket = (event) => {
      const now = performance.now();
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
      document.documentElement.style.setProperty("--cursor-opacity", "1");

      if (now - lastRef.current < 22) {
        return;
      }

      lastRef.current = now;
      const id = idRef.current + 1;
      idRef.current = id;

      const packet = {
        id,
        x: event.clientX,
        y: event.clientY,
        size: event.pointerType === "touch" ? 18 : 12 + (id % 4) * 3
      };

      setPackets((current) => [...current.slice(-MAX_PACKETS + 1), packet]);
      window.setTimeout(() => {
        setPackets((current) => current.filter((item) => item.id !== id));
      }, 720);
    };

    const hideCursor = () => {
      document.documentElement.style.setProperty("--cursor-opacity", "0");
    };

    window.addEventListener("pointermove", addPacket, { passive: true });
    window.addEventListener("pointerdown", addPacket, { passive: true });
    window.addEventListener("pointerleave", hideCursor, { passive: true });

    return () => {
      window.removeEventListener("pointermove", addPacket);
      window.removeEventListener("pointerdown", addPacket);
      window.removeEventListener("pointerleave", hideCursor);
    };
  }, []);

  return (
    <div className="cursor-trail" aria-hidden="true">
      {packets.map((packet) => (
        <span
          className="cursor-trail__packet"
          key={packet.id}
          style={{
            "--packet-x": `${packet.x}px`,
            "--packet-y": `${packet.y}px`,
            "--packet-size": `${packet.size}px`
          }}
        />
      ))}
    </div>
  );
}
