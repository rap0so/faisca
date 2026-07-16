import Link from "next/link";
import { ProgressRing } from "@/components/progress/ProgressRing";
import { getProfile, getProgressMap } from "@/lib/progress";
import {
  CURRICULUM,
  moduleProgress,
  nextLesson,
  overallProgress,
} from "@/lib/selectors";
import styles from "./page.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function Dashboard() {
  const profile = getProfile();
  const map = getProgressMap();
  const overall = overallProgress(map);
  const resume = nextLesson(map);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Caderno de laboratório</p>
          <h1 className={styles.title}>
            Oi, {profile.display_name}. Vamos animar alguma coisa?
          </h1>
          <p className={styles.lede}>
            Um estúdio pessoal pra estudar movimento na web — da física das
            partículas ao bom gosto de quando <em>não</em> animar.
          </p>
        </div>
        <div className={styles.stats}>
          <Stat value={profile.xp} label="XP" accent="spark" />
          <Stat
            value={profile.current_streak}
            label="dias de ofensiva"
            accent="mint"
          />
          <Stat
            value={`${overall.done}/${overall.total}`}
            label="lições"
            accent="pulse"
          />
        </div>
      </header>

      <section className={styles.resume}>
        <ProgressRing value={overall.value} size={116} sublabel="do curso" />
        <div className={styles.resumeText}>
          <p className={styles.resumeKicker}>Continuar de onde parou</p>
          <h2 className={styles.resumeTitle}>{resume.lesson.title}</h2>
          <p className={styles.resumeMeta}>
            Módulo {resume.module.index} · {resume.module.title}
          </p>
          <Link
            href={`/curso/${resume.module.slug}/${resume.lesson.slug}`}
            className={styles.resumeCta}
          >
            {map[resume.lesson.slug] ? "Retomar" : "Começar"} →
          </Link>
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Os 8 módulos</h2>
        <div className={styles.grid}>
          {CURRICULUM.map((module) => {
            const p = moduleProgress(module, map);
            return (
              <Link
                key={module.slug}
                href={`/curso/${module.slug}`}
                className={styles.card}
              >
                <ProgressRing
                  value={p.value}
                  size={72}
                  stroke={6}
                  label={`${p.done}/${p.total}`}
                />
                <div>
                  <p className={styles.cardIndex}>Módulo {module.index}</p>
                  <h3 className={styles.cardTitle}>{module.title}</h3>
                  <p className={styles.cardTagline}>{module.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({
  value,
  label,
  accent,
}: {
  value: number | string;
  label: string;
  accent: string;
}) {
  return (
    <div className={styles.stat} data-accent={accent}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
