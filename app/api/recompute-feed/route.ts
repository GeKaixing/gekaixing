import { recomputeAndCacheHomeFeed } from "@/lib/feed/service";
import { createClient } from "@/utils/auth-compat/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as { userId?: string };
    const targetUserId = body.userId ?? user.id;

    if (targetUserId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const postIds = await recomputeAndCacheHomeFeed(targetUserId);
    return NextResponse.json({ success: true, count: postIds.length });
  } catch (error) {
    console.error("Recompute feed failed:", error);
    return NextResponse.json({ error: "Recompute feed failed" }, { status: 500 });
  }
}
