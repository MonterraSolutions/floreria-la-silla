'use client';

/**
 * Constelación de pétalos.
 * Adaptado de ConstellationGrid (21st.dev): misma física de resorte-masa-amortiguador y
 * onda de choque según la velocidad del cursor, pero los puntos son pétalos de rosa,
 * el lienzo es transparente (el fondo lo pone la sección) y se ajusta a su contenedor.
 * Sin hilos ni etiquetas: solo los pétalos.
 */

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  angle: number;
  spin: number;
  /** px/s de caída en modo táctil */
  fall: number;
  flip: number;
  phase: number;
  tone: number;
  glow: number;
}

// del rosa palo del logo al rosa profundo; el rojo aparece poco
const TONES = ['#F4CFCF', '#ECB5B7', '#E09EA2', '#D2848B', '#B85465', '#A23B4D'];
const TONE_WEIGHTS = [0.22, 0.24, 0.2, 0.16, 0.1, 0.08];


function pickTone() {
  let r = Math.random();
  for (let i = 0; i < TONE_WEIGHTS.length; i++) {
    r -= TONE_WEIGHTS[i];
    if (r <= 0) return i;
  }
  return 0;
}

/** Dibuja un pétalo una sola vez en un canvas fuera de pantalla; luego solo se estampa. */
function makeSprite(color: string) {
  const w = 48;
  const h = 64;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.translate(w / 2, h / 2);

  g.beginPath();
  g.moveTo(0, h * 0.47);
  g.bezierCurveTo(-w * 0.56, h * 0.2, -w * 0.52, -h * 0.4, -w * 0.13, -h * 0.45);
  g.quadraticCurveTo(0, -h * 0.35, w * 0.13, -h * 0.45);
  g.bezierCurveTo(w * 0.52, -h * 0.4, w * 0.56, h * 0.2, 0, h * 0.47);
  g.closePath();

  const grad = g.createLinearGradient(0, h * 0.47, 0, -h * 0.45);
  grad.addColorStop(0, 'rgba(255,255,255,0.85)');
  grad.addColorStop(0.35, color);
  grad.addColorStop(1, color);
  g.fillStyle = grad;
  g.fill();

  // sombra suave en el borde para darle volumen
  g.globalCompositeOperation = 'source-atop';
  const edge = g.createRadialGradient(0, -h * 0.05, w * 0.1, 0, 0, w * 0.62);
  edge.addColorStop(0, 'rgba(0,0,0,0)');
  edge.addColorStop(1, 'rgba(90,20,35,0.22)');
  g.fillStyle = edge;
  g.fillRect(-w / 2, -h / 2, w, h);

  // vena central
  g.globalCompositeOperation = 'source-over';
  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(0, h * 0.4);
  g.quadraticCurveTo(w * 0.04, 0, 0, -h * 0.3);
  g.stroke();
  return c;
}

interface PetalConstellationProps {
  className?: string;
  /** Separación promedio entre pétalos en px. */
  spacing?: number;
}

export default function PetalConstellation({ className, spacing }: PetalConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // en celular y tablet no hay cursor: los pétalos caen despacio por su cuenta, sin reaccionar al dedo
    const touchOnly = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const sprites = TONES.map(makeSprite);

    let animationFrameId = 0;
    let running = false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      radius: 170,
      lastReal: -Infinity,
    };

    let petals: Petal[] = [];

    const initPetals = () => {
      petals = [];
      const gap = spacing ?? (width < 640 ? 62 : 78);
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // retícula con desorden, para que se lea como pétalos sueltos y no como cuadrícula
          const x = i * gap + (Math.random() - 0.5) * gap * 0.7;
          const y = j * gap + (Math.random() - 0.5) * gap * 0.7;
          petals.push({
            x,
            y,
            vx: 0,
            vy: 0,
            baseX: x,
            baseY: y,
            size: Math.random() * 6 + 9,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.3,
            fall: Math.random() * 8 + 6,
            flip: Math.random() * Math.PI * 2,
            phase: Math.random() * Math.PI * 2,
            tone: pickTone(),
            glow: 0,
          });
        }
      }
    };

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      initPetals();
      if (reduceMotion) drawFrame(0, performance.now());
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (y < -80 || y > rect.height + 80) return;
      mouse.x = x;
      mouse.y = y;
      mouse.lastReal = performance.now();
    };

    const handlePointerLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.lastReal = -Infinity;
    };

    let lastTime = performance.now();

    const drawFrame = (dt: number, now: number) => {
      const t = now / 1000;

      // Con mouse quieto, una "brisa" recorre el lienzo despacio (solo en computadora)
      if (touchOnly) {
        mouse.x = -1000;
        mouse.y = -1000;
      } else if (now - mouse.lastReal > 2500 && !reduceMotion) {
        mouse.x = width * (0.5 + 0.38 * Math.sin(t * 0.23));
        mouse.y = height * (0.5 + 0.32 * Math.sin(t * 0.31 + 1.2));
      }

      mouse.vx = (mouse.x - mouse.prevX) / (dt * 1000 || 1);
      mouse.vy = (mouse.y - mouse.prevY) / (dt * 1000 || 1);
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      const speed = Math.min(Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy), 6);
      const breeze = now - mouse.lastReal > 2500;
      const radius = breeze ? 130 : mouse.radius;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Motor de física: resorte de Hooke + amortiguamiento (igual que el original)
      const SPRING_K = 18;
      const DAMPING = 0.82;

      for (let i = 0; i < petals.length; i++) {
        const n = petals[i];
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius && dist > 0) {
          const power = 1 - dist / radius;
          const force = power * ((breeze ? 700 : 1500) + speed * 150);
          const angle = Math.atan2(dy, dx);
          n.vx -= Math.cos(angle) * force * dt;
          n.vy -= Math.sin(angle) * force * dt;
        }

        if (touchOnly && !reduceMotion) {
          // caída lenta: el ancla baja y, al salir por abajo, vuelve a entrar por arriba
          n.baseY += n.fall * dt;
          if (n.baseY > height + 24) {
            n.baseY -= height + 48;
            n.y = n.baseY;
            n.x = n.baseX;
            n.vx = 0;
            n.vy = 0;
          }
        }

        // el ancla se mece un poco, como si hubiera aire
        const sway = touchOnly ? 9 : 4;
        const homeX = n.baseX + Math.sin(t * (touchOnly ? 0.4 : 0.6) + n.phase) * sway;
        const homeY = n.baseY + Math.cos(t * 0.5 + n.phase) * 3;
        n.vx += (homeX - n.x) * SPRING_K * dt;
        n.vy += (homeY - n.y) * SPRING_K * dt;
        n.vx *= DAMPING;
        n.vy *= DAMPING;
        n.x += n.vx * dt * 60;
        n.y += n.vy * dt * 60;

        // el pétalo gira y se voltea según qué tan rápido lo empujan
        const v = Math.abs(n.vx) + Math.abs(n.vy);
        n.angle += (n.spin + n.vx * 0.04) * dt;
        n.flip += dt * ((touchOnly ? 0.5 : 0.7) + v * 0.35);

        const near = dist < radius ? 1 : 0;
        n.glow += (near - n.glow) * Math.min(1, dt * 6);
      }

      // Pétalos (sprites con rotación y volteo)
      for (let i = 0; i < petals.length; i++) {
        const n = petals[i];
        const s = (n.size / 32) * (1 + n.glow * 0.55);
        const sx = s;
        const sy = s * (0.4 + 0.6 * Math.abs(Math.cos(n.flip)));
        const cos = Math.cos(n.angle);
        const sin = Math.sin(n.angle);
        ctx.setTransform(dpr * cos * sx, dpr * sin * sx, -dpr * sin * sy, dpr * cos * sy, dpr * n.x, dpr * n.y);
        ctx.globalAlpha = 0.55 + n.glow * 0.45;
        ctx.drawImage(sprites[n.tone], -24, -32);
        if (n.glow > 0.05) {
          ctx.globalAlpha = n.glow * 0.8;
          ctx.drawImage(sprites[Math.min(n.tone + 2, TONES.length - 1)], -24, -32);
        }
      }
      ctx.globalAlpha = 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    };

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      drawFrame(dt, now);
      animationFrameId = requestAnimationFrame(render);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(render);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animationFrameId);
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(host);
    // solo anima mientras el hero está en pantalla
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(host);
    if (!touchOnly) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      document.addEventListener('pointerleave', handlePointerLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [spacing]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 block', className)}
    />
  );
}
