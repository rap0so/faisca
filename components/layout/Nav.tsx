"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/conquistas", label: "Conquistas" },
  { href: "/playground", label: "Playground" },
  { href: "/desafios", label: "Desafios" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.brand} aria-label="Faísca — início">
        <SparkMark />
        <span className={styles.wordmark}>Faísca</span>
      </Link>

      <nav className={styles.links} aria-label="Navegação principal">
        {LINKS.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={styles.link}
              data-active={active || undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

/** Small animated spark — a single signature flourish, quiet at rest. */
function SparkMark() {
  return (
    <svg
      className={styles.mark}
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path
        d="M12 2 L14 9 L21 12 L14 15 L12 22 L10 15 L3 12 L10 9 Z"
        fill="var(--spark)"
      />
    </svg>
  );
}
