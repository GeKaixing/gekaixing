export interface GLMMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export async function streamGLM(messages: GLMMessage[]): Promise<Response> {
  return fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: "glm-5",
      stream: true,
      temperature: 0.7,
      messages,
    }),
  });
}
