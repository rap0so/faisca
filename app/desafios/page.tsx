import Link from "next/link";
import { getModule } from "@/content/curriculum";
import { getProgressMap } from "@/lib/progress";
import styles from "./desafios.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function DesafiosPage() {
  const module = getModule("desafios-finais");
  const map = getProgressMap();
  if (!module) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Módulo {module.index}</p>
        <h1 className={styles.title}>Desafios Finais</h1>
        <p className={styles.lede}>
          Peças abertas, sem rodinhas. Aqui você junta tudo — partículas, SVG,
          canvas, bom gosto — numa coisa só sua. A última é candidata a case
          study do portfólio.
        </p>
      </header>

      <div className={styles.grid}>
        {module.lessons.map((lesson, i) => {
          const status = map[lesson.slug]?.status ?? "not_started";
          return (
            <Link
              key={lesson.slug}
              href={`/curso/${module.slug}/${lesson.slug}`}
              className={styles.card}
              data-status={status}
            >
              <span className={styles.num}>{i + 1}</span>
              <h2 className={styles.cardTitle}>{lesson.title}</h2>
              {lesson.subtitle && (
                <p className={styles.cardSub}>{lesson.subtitle}</p>
              )}
              <span className={styles.xp}>{lesson.xp} XP</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
