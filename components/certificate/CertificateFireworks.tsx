"use client";

import { useEffect, useRef } from "react";
import styles from "./CertificateFireworks.module.css";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

const COLORS = ["#ffb03a", "#7c5cff", "#3ecf8e", "#ff6b6b", "#f5f2ea"];

/**
 * The graduation reward: procedural Canvas fireworks (the Módulo 4 technique
 * dogfooded) behind the certificate. Respects prefers-reduced-motion — with it
 * on, nothing animates and the canvas stays empty.
 */
export function CertificateFireworks() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function burst(x: number, y: number) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const count = 34 + Math.floor(Math.random() * 20);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 1.5 + Math.random() * 3.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          life: 1,
        });
      }
    }

    let tick = 0;
    function frame() {
      if (!ctx) return;
      ctx.fillStyle = "rgba(14, 15, 20, 0.22)";
      ctx.fillRect(0, 0, width, height);

      tick++;
      if (tick % 55 === 0) {
        burst(
          width * (0.15 + Math.random() * 0.7),
          height * (0.15 + Math.random() * 0.45),
        );
      }

      for (const p of particles) {
        p.vy += 0.03;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.009;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
      }
      ctx.globalAlpha = 1;
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].life <= 0) particles.splice(i, 1);
      }
      raf = requestAnimationFrame(frame);
    }

    // a couple of welcome bursts
    burst(width * 0.3, height * 0.35);
    burst(width * 0.7, height * 0.3);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Decorative canvas — no ARIA needed (empty canvas has no announced content).
  return <canvas ref={ref} className={styles.canvas} />;
}
