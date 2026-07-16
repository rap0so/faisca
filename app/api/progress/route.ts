import { NextResponse } from "next/server";
import {
  completeLesson,
  getProfile,
  getProgressMap,
  getUnlockedBadges,
  markSolutionViewed,
  recordAttempt,
  saveCode,
} from "@/lib/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    profile: getProfile(),
    progress: getProgressMap(),
    badges: getUnlockedBadges(),
  });
}

interface Body {
  action: "save" | "attempt" | "complete" | "reveal";
  slug: string;
  files?: unknown;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body?.slug || !body?.action) {
    return NextResponse.json(
      { error: "É preciso informar action e slug" },
      { status: 400 },
    );
  }

  switch (body.action) {
    case "save":
      return NextResponse.json({ progress: saveCode(body.slug, body.files) });
    case "attempt":
      return NextResponse.json({ progress: recordAttempt(body.slug) });
    case "reveal":
      return NextResponse.json({ progress: markSolutionViewed(body.slug) });
    case "complete":
      return NextResponse.json(completeLesson(body.slug));
    default:
      return NextResponse.json({ error: "Ação desconhecida" }, { status: 400 });
  }
}
