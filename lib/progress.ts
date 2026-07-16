import { CURRICULUM, getLessonBySlug } from "@/content/curriculum";
import { getDb } from "@/lib/db";

/**
 * Progress service — the business logic over the SQLite tables (§7): XP, streak
 * bookkeeping and badge awarding. Server-only (imports better-sqlite3).
 */

export interface Profile {
  display_name: string;
  xp: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export type LessonStatus = "not_started" | "in_progress" | "completed";

export interface LessonProgressRow {
  lesson_slug: string;
  status: LessonStatus;
  attempts: number;
  completed_at: string | null;
  saved_code: string | null;
  updated_at: string;
  /** 1 once the reference solution has been revealed for this lesson */
  solution_viewed: number;
}

/** Lessons that count toward the "Physics Nerd" badge (§7). */
const PHYSICS_LESSONS = ["m1-physics", "m4-physics"];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getProfile(): Profile {
  const db = getDb();
  return db
    .prepare(
      "select display_name, xp, current_streak, longest_streak, last_activity_date from profile where id = 1",
    )
    .get() as Profile;
}

export function getAllProgress(): LessonProgressRow[] {
  const db = getDb();
  return db
    .prepare("select * from lesson_progress")
    .all() as LessonProgressRow[];
}

export function getProgressMap(): Record<string, LessonProgressRow> {
  const map: Record<string, LessonProgressRow> = {};
  for (const row of getAllProgress()) map[row.lesson_slug] = row;
  return map;
}

export function getLessonProgress(slug: string): LessonProgressRow | undefined {
  const db = getDb();
  return db
    .prepare("select * from lesson_progress where lesson_slug = ?")
    .get(slug) as LessonProgressRow | undefined;
}

function upsertProgress(
  slug: string,
  fields: Partial<Pick<LessonProgressRow, "status" | "saved_code">> & {
    bumpAttempt?: boolean;
    completed_at?: string | null;
  },
) {
  const db = getDb();
  const existing = getLessonProgress(slug);
  const status = fields.status ?? existing?.status ?? "in_progress";
  const attempts = (existing?.attempts ?? 0) + (fields.bumpAttempt ? 1 : 0);
  const saved_code =
    fields.saved_code !== undefined
      ? fields.saved_code
      : (existing?.saved_code ?? null);
  const completed_at =
    fields.completed_at !== undefined
      ? fields.completed_at
      : (existing?.completed_at ?? null);

  db.prepare(
    `insert into lesson_progress (lesson_slug, status, attempts, completed_at, saved_code, updated_at)
     values (@slug, @status, @attempts, @completed_at, @saved_code, datetime('now'))
     on conflict(lesson_slug) do update set
       status = @status,
       attempts = @attempts,
       completed_at = @completed_at,
       saved_code = @saved_code,
       updated_at = datetime('now')`,
  ).run({ slug, status, attempts, completed_at, saved_code });

  return getLessonProgress(slug) as LessonProgressRow;
}

/** Persist the editor snapshot for a lesson (autosave). */
export function saveCode(slug: string, files: unknown): LessonProgressRow {
  return upsertProgress(slug, { saved_code: JSON.stringify(files) });
}

/** Record a "Verificar" attempt (whether or not it passed). */
export function recordAttempt(slug: string): LessonProgressRow {
  return upsertProgress(slug, { status: "in_progress", bumpAttempt: true });
}

/** Flag that the learner revealed the reference solution for a lesson. */
export function markSolutionViewed(slug: string): LessonProgressRow {
  const db = getDb();
  // Ensure a row exists, then set the flag.
  upsertProgress(slug, { status: "in_progress" });
  db.prepare(
    "update lesson_progress set solution_viewed = 1 where lesson_slug = ?",
  ).run(slug);
  return getLessonProgress(slug) as LessonProgressRow;
}

function awardBadge(id: string): boolean {
  const db = getDb();
  const res = db
    .prepare("insert or ignore into achievements (badge_id) values (?)")
    .run(id);
  return res.changes > 0;
}

export function getUnlockedBadges(): string[] {
  const db = getDb();
  return (
    db.prepare("select badge_id from achievements").all() as {
      badge_id: string;
    }[]
  ).map((r) => r.badge_id);
}

function updateStreak(profile: Profile): {
  current_streak: number;
  longest_streak: number;
} {
  const day = today();
  if (profile.last_activity_date === day) {
    return {
      current_streak: profile.current_streak,
      longest_streak: profile.longest_streak,
    };
  }
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const current =
    profile.last_activity_date === yesterday ? profile.current_streak + 1 : 1;
  const longest = Math.max(current, profile.longest_streak);
  return { current_streak: current, longest_streak: longest };
}

export interface CompletionResult {
  profile: Profile;
  gainedXp: number;
  newBadges: string[];
  alreadyCompleted: boolean;
}

/**
 * Mark a lesson completed: award XP once, advance the streak, and evaluate
 * badges (first lesson, module completion, full-course "Formado").
 */
export function completeLesson(slug: string): CompletionResult {
  const found = getLessonBySlug(slug);
  if (!found) throw new Error(`Unknown lesson: ${slug}`);
  const db = getDb();

  const existing = getLessonProgress(slug);
  const alreadyCompleted = existing?.status === "completed";

  upsertProgress(slug, {
    status: "completed",
    completed_at: new Date().toISOString(),
    bumpAttempt: false,
  });

  let profile = getProfile();
  const newBadges: string[] = [];
  let gainedXp = 0;

  if (!alreadyCompleted) {
    gainedXp = found.lesson.xp;
    const streak = updateStreak(profile);
    db.prepare(
      `update profile set xp = xp + ?, current_streak = ?, longest_streak = ?, last_activity_date = ? where id = 1`,
    ).run(gainedXp, streak.current_streak, streak.longest_streak, today());

    // "Primeira Faísca" — first ever completed lesson.
    const completedCount = (
      db
        .prepare(
          "select count(*) as n from lesson_progress where status = 'completed'",
        )
        .get() as { n: number }
    ).n;
    if (completedCount === 1 && awardBadge("primeira-faisca")) {
      newBadges.push("primeira-faisca");
    }

    // Streak badge.
    if (streak.current_streak >= 7 && awardBadge("maratonista")) {
      newBadges.push("maratonista");
    }

    // "Persistente" — solved after 5+ attempts without revealing the solution.
    const thisRow = getLessonProgress(slug);
    if (
      thisRow &&
      thisRow.attempts >= 5 &&
      !thisRow.solution_viewed &&
      awardBadge("persistente")
    ) {
      newBadges.push("persistente");
    }

    // Completed lessons + those whose solution was revealed.
    const rows = db
      .prepare(
        "select lesson_slug, status, solution_viewed from lesson_progress",
      )
      .all() as Pick<
      LessonProgressRow,
      "lesson_slug" | "status" | "solution_viewed"
    >[];
    const completedSlugs = new Set(
      rows.filter((r) => r.status === "completed").map((r) => r.lesson_slug),
    );
    const viewedSolution = new Set(
      rows.filter((r) => r.solution_viewed).map((r) => r.lesson_slug),
    );

    // Module-completion badges + "Perfeccionista" (module done, no solution peek).
    for (const module of CURRICULUM) {
      const done = module.lessons.every((l) => completedSlugs.has(l.slug));
      if (done && awardBadge(module.badgeId)) newBadges.push(module.badgeId);
      if (
        done &&
        module.lessons.every((l) => !viewedSolution.has(l.slug)) &&
        awardBadge("perfeccionista")
      ) {
        newBadges.push("perfeccionista");
      }
    }

    // "Physics Nerd" — every physics lesson complete.
    if (
      PHYSICS_LESSONS.every((s) => completedSlugs.has(s)) &&
      awardBadge("physics-nerd")
    ) {
      newBadges.push("physics-nerd");
    }

    // "Formado" — every lesson complete.
    const total = CURRICULUM.reduce((n, m) => n + m.lessons.length, 0);
    if (completedSlugs.size >= total && awardBadge("formado")) {
      newBadges.push("formado");
    }
  }

  profile = getProfile();
  return { profile, gainedXp, newBadges, alreadyCompleted };
}
