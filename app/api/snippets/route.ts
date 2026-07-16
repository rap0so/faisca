import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SnippetRow {
  id: string;
  title: string;
  files: string;
  created_at: string;
}

export function GET() {
  const db = getDb();
  const rows = db
    .prepare("select * from playground_snippets order by created_at desc")
    .all() as SnippetRow[];
  return NextResponse.json({
    snippets: rows.map((r) => ({ ...r, files: JSON.parse(r.files) })),
  });
}

export async function POST(req: Request) {
  let body: { title?: string; files?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const id = randomUUID();
  const db = getDb();
  db.prepare(
    "insert into playground_snippets (id, title, files) values (?, ?, ?)",
  ).run(id, body.title ?? "Sem título", JSON.stringify(body.files ?? {}));

  // "Cientista" — 10 snippets saved in the playground (§7).
  const { n } = db
    .prepare("select count(*) as n from playground_snippets")
    .get() as { n: number };
  let newBadge: string | null = null;
  if (n >= 10) {
    const res = db
      .prepare("insert or ignore into achievements (badge_id) values (?)")
      .run("cientista");
    if (res.changes > 0) newBadge = "cientista";
  }

  return NextResponse.json({ id, newBadge });
}
