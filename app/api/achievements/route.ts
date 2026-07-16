import { NextResponse } from "next/server";
import { BADGES } from "@/lib/badges";
import { getUnlockedBadges } from "@/lib/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const unlocked = new Set(getUnlockedBadges());
  return NextResponse.json({
    badges: BADGES.map((b) => ({ ...b, unlocked: unlocked.has(b.id) })),
  });
}
