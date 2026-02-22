import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" });

  await prisma.chatAISession.deleteMany({
    where: { id: sessionId, userId: user.id },
  });

  return NextResponse.json({ success: true });
}