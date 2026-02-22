import { prisma } from "@/lib/prisma";
import { streamGLM } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { sessionId, text } = await req.json();

  // const res = await streamGLM([
  //   { role: "system", content: "生成一个不超过12字标题" },
  //   { role: "user", content: text },
  // ]);

  // const data = await res.json();
  // const title = data.choices?.[0]?.message?.content ?? "新对话";

  // await prisma.chatAISession.update({
  //   where: { id: sessionId },
  //   // data: { title },
  //   data: { title: "新对话" },
  // });

  return NextResponse.json({ title: "新对话" });
}