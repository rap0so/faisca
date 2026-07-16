"use client";

import { useState } from "react";
import styles from "./TransitionDemo.module.css";

const EASINGS = [
  { label: "linear", value: "linear" },
  { label: "ease", value: "ease" },
  { label: "spring-ish", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
] as const;

/**
 * Live demo for the transitions lesson: toggle the same movement across a few
 * timing functions to *feel* how easing changes personality. Purely visual.
 */
export function TransitionDemo() {
  const [on, setOn] = useState(false);
  const [easing, setEasing] = useState<string>(EASINGS[2].value);

  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        <div
          className={styles.ball}
          style={{
            transform: on ? "translateX(180px)" : "translateX(0)",
            transitionTimingFunction: easing,
          }}
        />
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.go}
          onClick={() => setOn((v) => !v)}
        >
          {on ? "Voltar" : "Animar"}
        </button>
        <div className={styles.easings}>
          {EASINGS.map((e) => (
            <button
              key={e.value}
              type="button"
              className={styles.chip}
              data-active={easing === e.value || undefined}
              onClick={() => setEasing(e.value)}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
