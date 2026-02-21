import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await fetch(
    "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: "glm-5",
        messages,
        stream: true,
        temperature: 0.7,
      }),
    }
  );

  if (!response.body) {
    return NextResponse.json({ error: "No stream" }, { status: 500 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        // GLM 返回：
        // data: {...}
        // data: {...}

        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;

          const jsonStr = line.replace("data:", "").trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const json = JSON.parse(jsonStr);
            const text =
              json.choices?.[0]?.delta?.content ||
              json.choices?.[0]?.message?.content ||
              "";

            controller.enqueue(encoder.encode(text));
          } catch {}
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}