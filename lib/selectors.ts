import { CURRICULUM, flatLessons, type Module } from "@/content/curriculum";
import type { LessonProgressRow } from "@/lib/progress";

export type ProgressMap = Record<string, LessonProgressRow>;

export function isCompleted(map: ProgressMap, slug: string): boolean {
  return map[slug]?.status === "completed";
}

export function moduleProgress(
  module: Module,
  map: ProgressMap,
): { done: number; total: number; value: number } {
  const total = module.lessons.length;
  const done = module.lessons.filter((l) => isCompleted(map, l.slug)).length;
  return { done, total, value: total ? done / total : 0 };
}

export function overallProgress(map: ProgressMap): {
  done: number;
  total: number;
  value: number;
} {
  const all = flatLessons();
  const done = all.filter((x) => isCompleted(map, x.lesson.slug)).length;
  return { done, total: all.length, value: all.length ? done / all.length : 0 };
}

/** The lesson to resume: first in-progress, else first not-completed, in order. */
export function nextLesson(map: ProgressMap) {
  const all = flatLessons();
  const inProgress = all.find(
    (x) => map[x.lesson.slug]?.status === "in_progress",
  );
  if (inProgress) return inProgress;
  const notDone = all.find((x) => !isCompleted(map, x.lesson.slug));
  return notDone ?? all[0];
}

export { CURRICULUM };
