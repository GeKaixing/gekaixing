import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  console.log(searchParams)
  const sessionId = searchParams.get("sessionId");
  const cursor = searchParams.get("cursor");

  if (!sessionId) return NextResponse.json({ messages: [] });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await prisma.chatAIMessage.findMany({
    where: {
      sessionId,
      session: { userId: user.id },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });

  return NextResponse.json({
    messages: messages.reverse(),
    nextCursor: messages[0]?.id ?? null,
  });
}