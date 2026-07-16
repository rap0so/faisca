import Link from "next/link";
import { BADGES } from "@/lib/badges";
import { getProfile, getUnlockedBadges } from "@/lib/progress";
import styles from "./conquistas.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function ConquistasPage() {
  const profile = getProfile();
  const unlocked = new Set(getUnlockedBadges());
  const graduated = unlocked.has("formado");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Conquistas</h1>
        <div className={styles.tally}>
          <span>
            <strong>{unlocked.size}</strong>/{BADGES.length} badges
          </span>
          <span>
            <strong>{profile.xp}</strong> XP
          </span>
          <span>
            ofensiva de <strong>{profile.current_streak}</strong> · recorde{" "}
            <strong>{profile.longest_streak}</strong>
          </span>
        </div>
      </header>

      <Link
        href="/certificado"
        className={styles.certLink}
        data-earned={graduated || undefined}
      >
        {graduated ? (
          <>
            🎓 <strong>Seu certificado está pronto</strong> — ver a formatura →
          </>
        ) : (
          <>🔒 Certificado de conclusão — desbloqueia ao concluir o curso →</>
        )}
      </Link>

      <div className={styles.grid}>
        {BADGES.map((badge) => {
          const has = unlocked.has(badge.id);
          return (
            <div
              key={badge.id}
              className={styles.badge}
              data-unlocked={has || undefined}
            >
              <div className={styles.medal} aria-hidden="true">
                {has ? "✦" : "?"}
              </div>
              <p className={styles.badgeName}>
                {has ? badge.name : "Badge bloqueada"}
              </p>
              <p className={styles.badgeHint}>{badge.hint}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
