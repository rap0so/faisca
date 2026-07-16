import Link from "next/link";
import { CertificateFireworks } from "@/components/certificate/CertificateFireworks";
import { getProfile, getProgressMap, getUnlockedBadges } from "@/lib/progress";
import { nextLesson, overallProgress } from "@/lib/selectors";
import styles from "./certificado.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Certificado — Faísca" };

export default function CertificadoPage() {
  const profile = getProfile();
  const graduated = getUnlockedBadges().includes("formado");
  const map = getProgressMap();
  const overall = overallProgress(map);

  if (!graduated) {
    const resume = nextLesson(map);
    return (
      <div className={styles.page}>
        <div className={styles.locked}>
          <div className={styles.lockMark} aria-hidden="true">
            🔒
          </div>
          <h1 className={styles.lockTitle}>Seu certificado está esperando</h1>
          <p className={styles.lockText}>
            Ele se revela — com fogos e tudo — quando você concluir o curso
            inteiro. Você já está em{" "}
            <strong>
              {overall.done}/{overall.total}
            </strong>{" "}
            lições. Falta pouco para a formatura.
          </p>
          <Link
            href={`/curso/${resume.module.slug}/${resume.lesson.slug}`}
            className={styles.lockCta}
          >
            Continuar de onde parei →
          </Link>
        </div>
      </div>
    );
  }

  const dateStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.page}>
      <div className={styles.stage}>
        <CertificateFireworks />
        <article className={styles.cert}>
          <div className={styles.mark}>
            <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
              <path
                d="M12 2 L14 9 L21 12 L14 15 L12 22 L10 15 L3 12 L10 9 Z"
                fill="var(--spark)"
              />
            </svg>
          </div>
          <p className={styles.kicker}>Certificado de Conclusão</p>
          <p className={styles.presented}>Este certificado é concedido a</p>
          <h1 className={styles.name}>{profile.display_name}</h1>
          <p className={styles.body}>
            por concluir <strong>Faísca — laboratório de animação web</strong>,
            dominando movimento na web das partículas ao bom gosto de quando{" "}
            <em>não</em> animar.
          </p>
          <div className={styles.stats}>
            <div>
              <span className={styles.statValue}>{profile.xp}</span>
              <span className={styles.statLabel}>XP conquistados</span>
            </div>
            <div>
              <span className={styles.statValue}>{overall.total}</span>
              <span className={styles.statLabel}>lições concluídas</span>
            </div>
            <div>
              <span className={styles.statValue}>{profile.longest_streak}</span>
              <span className={styles.statLabel}>maior ofensiva</span>
            </div>
          </div>
          <div className={styles.footer}>
            <span className={styles.date}>{dateStr}</span>
            <span className={styles.sig}>Faísca ✦</span>
          </div>
        </article>
      </div>
      <div className={styles.actions}>
        <Link href="/conquistas" className={styles.back}>
          ← Voltar às conquistas
        </Link>
      </div>
    </div>
  );
}
