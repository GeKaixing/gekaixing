import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { messages, sessionId } = body;
    const supabse = await createClient();
    const {
      data: { user },
    } = await supabse.auth.getUser();
    const userId = user?.id;
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!messages?.length) {
      return new Response("messages required", { status: 400 });
    }

    if (!userId) {
      return new Response("userId required", { status: 400 });
    }

    // ⭐ 没 sessionId → 自动创建
    let currentSessionId = sessionId;

    if (!currentSessionId) {
      const session = await prisma.chatAISession.create({
        data: {
          userId,
        },
      });

      currentSessionId = session.id;
    }

    // ⭐ session 不存在 → 自动创建（防止外键错误）
    await prisma.chatAISession.upsert({
      where: { id: currentSessionId },
      create: {
        id: currentSessionId,
        userId,
      },
      update: {},
    });

    // ===== 保存 user message =====
    const lastUserMessage = messages[messages.length - 1];

    if (lastUserMessage?.role === "user") {
      await prisma.chatAIMessage.create({
        data: {
          id: crypto.randomUUID(),
          role: "user",
          content: lastUserMessage.content,
          sessionId: currentSessionId,
        },
      });
    }

    // ===== 模拟 AI streaming（换成你自己的 AI）=====
    const encoder = new TextEncoder();

    let fullText = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const fakeResponse =
            "感谢您的提问。让我为您详细解答...这是一个模拟的流式返回测试，每个字符都会逐步显示。";

          for (const char of fakeResponse) {
            fullText += char;

            controller.enqueue(encoder.encode(char));

            await new Promise((r) => setTimeout(r, 20));
          }

          // ===== 保存 assistant message =====
          await prisma.chatAIMessage.create({
            data: {
              id: crypto.randomUUID(),
              role: "assistant",
              content: fullText,
              sessionId: currentSessionId,
            },
          });

          controller.close();
        } catch (err) {
          console.error(err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Session-Id": currentSessionId, // ⭐ 返回 sessionId 给前端
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Error", { status: 500 });
  }
}
