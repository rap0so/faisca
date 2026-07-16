import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgressRing } from "@/components/progress/ProgressRing";
import { getModule } from "@/content/curriculum";
import { getProgressMap } from "@/lib/progress";
import { moduleProgress } from "@/lib/selectors";
import styles from "./module.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  completed: "Concluída",
  in_progress: "Em andamento",
  not_started: "Não iniciada",
};

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: moduleSlug } = await params;
  const module = getModule(moduleSlug);
  if (!module) notFound();

  const map = getProgressMap();
  const p = moduleProgress(module, map);

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Todos os módulos
      </Link>

      <header className={styles.header}>
        <div>
          <p className={styles.index}>Módulo {module.index}</p>
          <h1 className={styles.title}>{module.title}</h1>
          <p className={styles.tagline}>{module.tagline}</p>
        </div>
        <ProgressRing
          value={p.value}
          size={128}
          label={`${p.done}/${p.total}`}
          sublabel="lições"
        />
      </header>

      <ol className={styles.lessons}>
        {module.lessons.map((lesson, i) => {
          const status = map[lesson.slug]?.status ?? "not_started";
          return (
            <li key={lesson.slug}>
              <Link
                href={`/curso/${module.slug}/${lesson.slug}`}
                className={styles.lesson}
                data-status={status}
              >
                <span className={styles.num}>{i + 1}</span>
                <span className={styles.lessonBody}>
                  <span className={styles.lessonTitle}>{lesson.title}</span>
                  {lesson.subtitle && (
                    <span className={styles.lessonSub}>{lesson.subtitle}</span>
                  )}
                </span>
                <span className={styles.meta}>
                  <span className={styles.xp}>{lesson.xp} XP</span>
                  <span className={styles.status} data-status={status}>
                    {STATUS_LABEL[status]}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
