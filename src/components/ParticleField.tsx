import { useEffect, useRef } from "react";

/**
 * Lightweight vanilla-canvas snow/particle field with an aurora tint.
 * Draws drifting glow particles plus faint "constellation" links between
 * nearby particles, and reacts subtly to the pointer.
 * Respects prefers-reduced-motion (renders a single static frame).
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = window.innerWidth;
    let height = window.innerHeight;

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const colors = ["120,230,255", "180,150,255", "255,170,235", "150,255,220"];
    const count = Math.min(88, Math.floor(width / 16));

    type P = {
      x: number;
      y: number;
      r: number;
      vy: number;
      vx: number;
      a: number;
      tw: number;
      c: string;
    };
    const particles: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.4 + 0.6,
      vy: Math.random() * 0.5 + 0.12,
      vx: Math.random() * 0.4 - 0.2,
      a: Math.random() * 0.6 + 0.25,
      tw: Math.random() * Math.PI * 2,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    let raf = 0;
    const LINK_DIST = 120;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Constellation links
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const o = (1 - d / LINK_DIST) * 0.14;
            ctx.strokeStyle = `rgba(150,220,255,${o})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (const p of particles) {
        p.y += p.vy;
        p.x += p.vx;
        p.tw += 0.03;

        // gentle pointer repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 110) {
          const f = (1 - md / 110) * 1.4;
          p.x += (mdx / (md || 1)) * f;
          p.y += (mdy / (md || 1)) * f;
        }

        if (p.y > height + 5) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x > width + 5) p.x = -5;
        if (p.x < -5) p.x = width + 5;

        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${p.c},0.85)`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
    }

    window.addEventListener("resize", setSize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
    />
  );
}
