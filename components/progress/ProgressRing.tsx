import styles from "./ProgressRing.module.css";

/**
 * The platform's signature element (§8): a living SVG line drawn with
 * stroke-dashoffset that springs into place and "breathes" on mount — the
 * Módulo 2 technique applied to the UI itself. prefers-reduced-motion freezes
 * both the draw and the ripple (see the CSS).
 */
export function ProgressRing({
  value,
  size = 120,
  stroke = 8,
  label,
  sublabel,
}: {
  /** 0..1 */
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, value));
  const offset = circ * (1 - clamped);
  const pct = Math.round(clamped * 100);

  return (
    <div className={styles.wrap} style={{ width: size, height: size }}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-label={label ? `${label}: ${pct}%` : `${pct}% concluído`}
      >
        <circle
          className={styles.track}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          className={styles.line}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ ["--circ" as string]: `${circ}` }}
        />
      </svg>
      <div className={styles.center}>
        <span className={styles.label}>{label ?? `${pct}%`}</span>
        {sublabel && <span className={styles.sublabel}>{sublabel}</span>}
      </div>
    </div>
  );
}
