import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

/**
 * Local SQLite persistence (§7). Single user, no auth — the DB lives on Will's
 * machine at data/progress.db and survives browser cache clears. Fully offline.
 *
 * The connection is memoised on globalThis so Next.js dev hot-reload doesn't
 * open a new handle on every module reload.
 */

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "progress.db");

const SCHEMA = `
create table if not exists profile (
  id integer primary key check (id = 1),
  display_name text,
  xp integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity_date text
);

create table if not exists lesson_progress (
  lesson_slug text primary key,
  status text check (status in ('not_started','in_progress','completed')),
  attempts integer default 0,
  completed_at text,
  saved_code text,
  updated_at text default (datetime('now'))
);

create table if not exists achievements (
  badge_id text primary key,
  unlocked_at text default (datetime('now'))
);

create table if not exists playground_snippets (
  id text primary key,
  title text,
  files text,
  created_at text default (datetime('now'))
);
`;

type Db = InstanceType<typeof Database>;

const globalForDb = globalThis as unknown as { __faiscaDb?: Db };

function createDb(): Db {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA);
  runMigrations(db);
  // Ensure the single profile row exists.
  db.prepare(
    "insert or ignore into profile (id, display_name, xp) values (1, 'Will', 0)",
  ).run();
  return db;
}

/** Additive migrations for DBs created before a column existed. */
function runMigrations(db: Db) {
  const cols = db.prepare("pragma table_info(lesson_progress)").all() as {
    name: string;
  }[];
  if (!cols.some((c) => c.name === "solution_viewed")) {
    db.exec(
      "alter table lesson_progress add column solution_viewed integer default 0",
    );
  }
}

export function getDb(): Db {
  if (!globalForDb.__faiscaDb) {
    globalForDb.__faiscaDb = createDb();
  }
  return globalForDb.__faiscaDb;
}
