import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonWorkspace } from "@/components/editor/LessonWorkspace";
import { VisualComplete } from "@/components/lesson/VisualComplete";
import type { EditorFile } from "@/content/curriculum";
import { adjacentLessons, getLesson } from "@/content/curriculum";
import { hasLessonContent, LESSON_CONTENT } from "@/content/lessons";
import { getLessonProgress } from "@/lib/progress";
import styles from "./lesson.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;
  const found = getLesson(moduleSlug, lessonSlug);
  if (!found) notFound();
  const { module, lesson } = found;

  const progress = getLessonProgress(lesson.slug);
  let savedFiles: EditorFile[] | null = null;
  if (progress?.saved_code) {
    try {
      savedFiles = JSON.parse(progress.saved_code) as EditorFile[];
    } catch {
      savedFiles = null;
    }
  }

  const Content = hasLessonContent(lesson.slug)
    ? (await LESSON_CONTENT[lesson.slug]()).default
    : null;

  const { prev, next } = adjacentLessons(lesson.slug);
  const hasWorkspace = Boolean(lesson.starter?.length);
  // Visual lessons with no code editor (conceptual + design/challenge modules)
  // get a checklist + "Marcar como concluída" control inline.
  const showVisualComplete =
    !hasWorkspace &&
    (lesson.validation === "visual" || lesson.validation === "both");

  return (
    <div className={styles.page} data-single={!hasWorkspace || undefined}>
      <article className={styles.content}>
        <div className={styles.crumbs}>
          <Link href={`/curso/${module.slug}`}>
            Módulo {module.index} · {module.title}
          </Link>
        </div>
        <h1 className={styles.title}>{lesson.title}</h1>
        {lesson.subtitle && (
          <p className={styles.subtitle}>{lesson.subtitle}</p>
        )}

        <div className={styles.prose}>
          {Content ? (
            <Content />
          ) : (
            <div className={styles.stub}>
              <p className={styles.stubKicker}>Conteúdo em construção</p>
              <p>
                Esta lição já tem seu lugar no mapa, mas o texto autoral ainda
                está sendo escrito. Enquanto isso, siga para a próxima faísca —
                o currículo inteiro está desenhado, uma lição de cada vez.
              </p>
            </div>
          )}
        </div>

        {showVisualComplete && (
          <VisualComplete
            lesson={lesson}
            initialCompleted={progress?.status === "completed"}
          />
        )}

        <nav className={styles.pager}>
          {prev ? (
            <Link
              href={`/curso/${prev.module.slug}/${prev.lesson.slug}`}
              className={styles.pagerLink}
            >
              <span className={styles.pagerDir}>← Anterior</span>
              <span className={styles.pagerTitle}>{prev.lesson.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/curso/${next.module.slug}/${next.lesson.slug}`}
              className={`${styles.pagerLink} ${styles.pagerNext}`}
            >
              <span className={styles.pagerDir}>Próxima →</span>
              <span className={styles.pagerTitle}>{next.lesson.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>

      {hasWorkspace && (
        <aside className={styles.workspace}>
          <LessonWorkspace
            lesson={lesson}
            initialFiles={savedFiles}
            initialAttempts={progress?.attempts ?? 0}
            initialCompleted={progress?.status === "completed"}
          />
        </aside>
      )}
    </div>
  );
}
