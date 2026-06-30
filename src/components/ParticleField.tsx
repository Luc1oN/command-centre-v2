import { useEffect, useRef } from 'react';
import { useHud } from '@/store';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Fullscreen constellation: drifting nodes + proximity links, theme-tinted. */
export function ParticleField() {
  const theme = useHud((s) => s.theme);
  const mode = useHud((s) => s.mode);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef('45,212,191');
  const dotAlpha = useRef(0.85);
  const linkAlpha = useRef(0.45);

  // Re-read accent rgb + mode-aware alphas whenever theme or mode changes
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const rgb = cs.getPropertyValue('--accent-rgb').trim();
    if (rgb) colorRef.current = rgb;
    dotAlpha.current = parseFloat(cs.getPropertyValue('--particle-alpha')) || 0.85;
    linkAlpha.current = parseFloat(cs.getPropertyValue('--link-alpha')) || 0.45;
  }, [theme, mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LINK = 150;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(120, Math.floor((w * h) / 15000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const rgb = colorRef.current;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            ctx.strokeStyle = `rgba(${rgb},${(1 - dist / LINK) * linkAlpha.current})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = `rgba(${rgb},${dotAlpha.current})`;
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4.2, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70" />;
}
