"use client";

import { useState } from "react";
import styles from "./SquashStretchDemo.module.css";

/**
 * Side-by-side bounce: a "flat" ball (linear, no deformation) vs. an "alive" one
 * (anticipation + squash & stretch + easing). Makes the animation principles
 * tangible — the same movement, one lifeless and one delicious.
 */
export function SquashStretchDemo() {
  const [playing, setPlaying] = useState(true);

  return (
    <div className={styles.wrap}>
      <div className={styles.columns}>
        <div className={styles.col}>
          <div className={styles.arena}>
            <div
              className={`${styles.ball} ${styles.flat}`}
              data-playing={playing || undefined}
            />
          </div>
          <span className={styles.tag}>sem princípios</span>
        </div>
        <div className={styles.col}>
          <div className={styles.arena}>
            <div
              className={`${styles.ball} ${styles.alive}`}
              data-playing={playing || undefined}
            />
          </div>
          <span className={styles.tag} data-good>
            com squash &amp; stretch
          </span>
        </div>
      </div>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setPlaying((v) => !v)}
      >
        {playing ? "Pausar" : "Reproduzir"}
      </button>
    </div>
  );
}
