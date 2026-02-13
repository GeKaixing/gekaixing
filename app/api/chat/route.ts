import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    // 使用 google 驱动，指定模型为 gemini-1.5-pro 或 gemini-1.5-flash
    model: google('gemini-1.5-flash'), 
    messages,
    // Gemini 支持设置安全设置或输出格式
    temperature: 0.7,
  });

  return result.toAIStreamResponse();
}