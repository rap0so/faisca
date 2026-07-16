"use client";

import { useState } from "react";
import styles from "./StaggerDemo.module.css";

const BARS = [0, 1, 2, 3, 4];

/**
 * The same list appearing "all at once" vs. "staggered". Staggering guides the
 * eye and reads as orchestration; simultaneity reads as a jump-cut. Toggle to
 * feel the difference in rhythm.
 */
export function StaggerDemo() {
  const [shown, setShown] = useState(false);
  const [stagger, setStagger] = useState(true);

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        {BARS.map((i) => (
          <div
            key={i}
            className={styles.bar}
            data-shown={shown || undefined}
            style={{
              transitionDelay: stagger && shown ? `${i * 90}ms` : "0ms",
            }}
          />
        ))}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.play}
          onClick={() => setShown((v) => !v)}
        >
          {shown ? "Esconder" : "Revelar"}
        </button>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={stagger}
            onChange={(e) => setStagger(e.target.checked)}
          />
          stagger (em cascata)
        </label>
      </div>
    </div>
  );
}
