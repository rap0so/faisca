"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./Celebration.module.css";

/**
 * Completion celebration: an XP toast + a small particle burst. This is the
 * course dogfooding itself — the Módulo 1 particle technique applied to the UI.
 * Respects prefers-reduced-motion (the burst simply doesn't render).
 */
export function Celebration({
  xp,
  onDone,
}: {
  xp: number;
  onDone: () => void;
}) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    );
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.3;
        const dist = 70 + Math.random() * 90;
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          delay: Math.random() * 80,
          hue: i % 3,
        };
      }),
    [],
  );

  return (
    <div className={styles.overlay} aria-live="polite">
      <div className={styles.toast}>
        <span className={styles.spark}>✦</span>
        <span>
          Lição concluída! <strong>+{xp} XP</strong>
        </span>
      </div>
      {!reduced && (
        <div className={styles.burst} aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className={styles.particle}
              data-hue={p.hue}
              style={
                {
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  "--delay": `${p.delay}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
