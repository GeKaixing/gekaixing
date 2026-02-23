import { streamGLM } from "@/lib/ai";
import type { GLMMessage } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages?: GLMMessage[]
      sessionId?: string
    };

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

    const glmResponse = await streamGLM(messages);
    if (!glmResponse.ok || !glmResponse.body) {
      const errorText = await glmResponse.text();
      console.error("GLM request failed:", errorText);
      return new Response("AI service unavailable", { status: 502 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let fullText = "";
    let buffer = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = glmResponse.body?.getReader();
          if (!reader) {
            throw new Error("Missing GLM stream reader");
          }

          const pushChunkText = (payload: string): void => {
            if (!payload || payload === "[DONE]") return;

            try {
              const parsed = JSON.parse(payload) as {
                choices?: Array<{ delta?: { content?: string } }>
              };
              const chunkText = parsed.choices?.[0]?.delta?.content;

              if (typeof chunkText === "string" && chunkText.length > 0) {
                fullText += chunkText;
                controller.enqueue(encoder.encode(chunkText));
              }
            } catch (parseError) {
              console.error("Failed to parse GLM SSE chunk:", parseError);
            }
          };

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine.startsWith("data:")) continue;

              const payload = trimmedLine.slice(5).trim();
              pushChunkText(payload);
            }
          }

          const tail = buffer.trim();
          if (tail.startsWith("data:")) {
            pushChunkText(tail.slice(5).trim());
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
        } catch (streamError) {
          console.error(streamError);
          controller.error(streamError);
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
