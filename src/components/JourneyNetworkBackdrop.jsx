import { useEffect, useRef } from "react";

const clampValue = (value, min, max) => Math.max(min, Math.min(max, value));

export function JourneyNetworkBackdrop({ className = "", density = 1, opacity = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return undefined;

    const root = canvas.parentElement;
    if (!root) return undefined;

    const reducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    const state = {
      dpr: 1,
      height: 0,
      lastTs: 0,
      particles: [],
      rafId: 0,
      time: 0,
      width: 0
    };

    const buildParticles = () => {
      const area = state.width * state.height;
      const count = clampValue(Math.round((area / 11000) * density), 56, 118);

      state.particles = Array.from({ length: count }, (_, index) => ({
        id: index,
        phase: Math.random() * Math.PI * 2,
        radius: 0.72 + Math.random() * 1,
        vx: (Math.random() - 0.5) * 0.62,
        vy: (Math.random() - 0.5) * 0.62,
        x: Math.random() * state.width,
        y: Math.random() * state.height
      }));
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      state.width = Math.max(320, rect.width);
      state.height = Math.max(260, rect.height);
      state.dpr = clampValue(window.devicePixelRatio || 1, 1, 2);
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      buildParticles();
    };

    const draw = (timestamp) => {
      if (!state.lastTs) {
        state.lastTs = timestamp;
      }

      const elapsed = timestamp - state.lastTs;
      if (elapsed < 16) {
        state.rafId = window.requestAnimationFrame(draw);
        return;
      }

      const delta = Math.min(elapsed, 30);
      state.lastTs = timestamp;
      state.time += delta * 0.001;

      context.clearRect(0, 0, state.width, state.height);

      const particles = state.particles;
      const maxDistance = Math.min(250, Math.max(150, state.width * 0.29));
      const maxDistanceSq = maxDistance * maxDistance;

      particles.forEach((particle) => {
        particle.x += particle.vx * delta * 0.05;
        particle.y += particle.vy * delta * 0.05;

        if (particle.x <= -18 || particle.x >= state.width + 18) {
          particle.vx *= -1;
        }

        if (particle.y <= -18 || particle.y >= state.height + 18) {
          particle.vy *= -1;
        }
      });

      context.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];

        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;

          if (distSq > maxDistanceSq) continue;

          const dist = Math.sqrt(distSq);
          const distanceFactor = 1 - dist / maxDistance;
          const phasePulse = (Math.sin(state.time * 2.1 + a.phase - b.phase * 0.65) + 1) / 2;
          if (phasePulse < 0.1) continue;

          const alpha = distanceFactor * (0.18 + 0.6 * phasePulse);
          context.strokeStyle = `rgba(35, 216, 153, ${alpha.toFixed(3)})`;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      particles.forEach((particle) => {
        const pulse = 0.64 + 0.36 * Math.sin(state.time * 2 + particle.phase);
        context.fillStyle = `rgba(166, 255, 214, ${(0.35 + pulse * 0.5).toFixed(3)})`;
        context.shadowColor = "rgba(35, 216, 153, 0.72)";
        context.shadowBlur = 9;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
      context.shadowBlur = 0;

      state.rafId = window.requestAnimationFrame(draw);
    };

    resize();

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(root);
    } else {
      window.addEventListener("resize", resize);
    }

    state.rafId = window.requestAnimationFrame(draw);

    return () => {
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", resize);
      }
    };
  }, [density]);

  return <canvas ref={canvasRef} className={`journey-network-canvas ${className}`.trim()} style={{ opacity }} aria-hidden="true" />;
}
