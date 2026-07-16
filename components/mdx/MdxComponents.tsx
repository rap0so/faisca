"use client";

import { type ReactNode, useId, useState } from "react";
import styles from "./MdxComponents.module.css";

/**
 * Custom MDX blocks (§5). The pedagogy is fixed: <Analogia> is always the first
 * block of a lesson, then <Demo>, <Aprofundamento> for the technical "why",
 * with <Dica> and <Meta> as supporting voices.
 */

/** Real-world analogy — the mandatory opener. Explained "for a 10-year-old". */
export function Analogia({
  children,
  titulo = "A analogia",
}: {
  children: ReactNode;
  titulo?: string;
}) {
  return (
    <aside className={styles.analogia} aria-label="Analogia do mundo real">
      <span className={styles.analogiaKicker}>
        <SparkGlyph /> {titulo}
      </span>
      <div className={styles.analogiaBody}>{children}</div>
    </aside>
  );
}

/** Inline interactive demo frame. Children are the live demo. */
export function Demo({
  children,
  titulo = "Demonstração",
}: {
  children: ReactNode;
  titulo?: string;
}) {
  return (
    <figure className={styles.demo}>
      <figcaption className={styles.demoCap}>{titulo}</figcaption>
      <div className={styles.demoStage}>{children}</div>
    </figure>
  );
}

/** Collapsible technical depth — the "por quê" behind the effect. */
export function Aprofundamento({
  children,
  titulo = "Aprofundamento técnico",
}: {
  children: ReactNode;
  titulo?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={styles.aprofundamento} data-open={open || undefined}>
      <button
        type="button"
        className={styles.aprofundamentoToggle}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.chevron} aria-hidden="true">
          ▸
        </span>
        {titulo}
      </button>
      {open && (
        <div id={id} className={styles.aprofundamentoBody}>
          {children}
        </div>
      )}
    </div>
  );
}

/** A short tip. */
export function Dica({ children }: { children: ReactNode }) {
  return (
    <aside className={styles.dica}>
      <span className={styles.dicaKicker}>Dica</span>
      <div>{children}</div>
    </aside>
  );
}

/** The exercise objective — what the learner must accomplish. */
export function Meta({ children }: { children: ReactNode }) {
  return (
    <aside className={styles.meta} aria-label="Objetivo do exercício">
      <span className={styles.metaKicker}>Sua missão</span>
      <div>{children}</div>
    </aside>
  );
}

function SparkGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <path
        d="M12 2 L14 9 L21 12 L14 15 L12 22 L10 15 L3 12 L10 9 Z"
        fill="currentColor"
      />
    </svg>
  );
}
