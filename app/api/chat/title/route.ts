import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

const DEFAULT_TITLE = "新对话";
const MAX_TITLE_LENGTH = 20;

function buildFallbackTitle(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return DEFAULT_TITLE;
  return normalized.slice(0, MAX_TITLE_LENGTH);
}

function normalizeTitle(title: string): string {
  const cleaned = title
    .replace(/["'`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return DEFAULT_TITLE;
  return cleaned.slice(0, MAX_TITLE_LENGTH);
}

async function generateAiTitle(text: string): Promise<string | null> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return null;
  }

  try {
    const result = await generateText({
      model: google("gemini-2.0-flash"),
      temperature: 0.2,
      maxOutputTokens: 32,
      prompt: [
        "你是标题生成器。",
        "根据用户首条消息生成一个简短会话标题。",
        `要求：不超过${MAX_TITLE_LENGTH}个中文字符，禁止标点结尾，直接输出标题本身。`,
        `用户消息：${text}`,
      ].join("\n"),
    });

    return normalizeTitle(result.text);
  } catch (error) {
    console.error("AI 生成标题失败:", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { sessionId, text } = (await req.json()) as {
      sessionId?: string;
      text?: string;
    };

    if (!sessionId || !text?.trim()) {
      return NextResponse.json(
        { error: "sessionId and text are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.chatAISession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const fallbackTitle = buildFallbackTitle(text);
    const aiTitle = await generateAiTitle(text);
    const nextTitle = aiTitle ?? fallbackTitle;

    await prisma.chatAISession.update({
      where: { id: session.id },
      data: { title: nextTitle },
    });

    return NextResponse.json({ title: nextTitle });
  } catch (error) {
    console.error("更新会话标题失败:", error);
    return NextResponse.json(
      { error: "Failed to generate title" },
      { status: 500 }
    );
  }
}
