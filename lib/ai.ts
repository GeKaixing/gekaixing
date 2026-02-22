// export async function streamGLM(messages: any[]) {
//   return fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.GLM_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "glm-5",
//       stream: true,
//       temperature: 0.7,
//       messages,
//     }),
//   });
// }

export async function streamGLM(messages: any[]) {
  // 根据用户消息生成更智能的回复
  const lastMessage = messages[messages.length - 1]?.content || "";
  
  let responseContent = "";
  if (lastMessage.includes("你好") || lastMessage.includes("hello")) {
    responseContent = "您好！很高兴为您服务。我是GLM-5模型，有什么可以帮您的吗？";
  } else if (lastMessage.includes("介绍") || lastMessage.includes("你是谁")) {
    responseContent = "我是GLM-5，一个智能对话助手。我可以回答各种问题、提供建议、帮助解决问题。";
  } else if (lastMessage.includes("帮助") || lastMessage.includes("help")) {
    responseContent = "当然可以！请告诉我您需要什么帮助，我会尽力为您解答。";
  } else {
    responseContent = "感谢您的提问。让我为您详细解答...这是一个模拟的流式返回测试，每个字符都会逐步显示。";
  }

  // 将内容拆分成单个字符或词组
  const chunks = [];
  for (let i = 0; i < responseContent.length; i++) {
    // 随机决定是否组合成词组（模拟自然语言）
    if (i < responseContent.length - 1 && Math.random() > 0.7) {
      chunks.push(responseContent.slice(i, i + 2));
      i++;
    } else {
      chunks.push(responseContent[i]);
    }
  }

  const encoder = new TextEncoder();
  let chunkIndex = 0;

  const stream = new ReadableStream({
    async start(controller) {
      for (const content of chunks) {
        // 随机延迟 30-150ms
        const delay = Math.floor(Math.random() * 120) + 30;
        await new Promise(resolve => setTimeout(resolve, delay));

        const chunk = {
          id: `mock_${Date.now()}_${chunkIndex}`,
          model: "glm-5",
          created: Math.floor(Date.now() / 1000),
          choices: [{
            index: 0,
            delta: {
              content: content
            },
            finish_reason: null
          }]
        };

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        chunkIndex++;
      }

      // 发送完成标记
      const endChunk = {
        id: `mock_${Date.now()}_end`,
        model: "glm-5",
        created: Math.floor(Date.now() / 1000),
        choices: [{
          index: 0,
          delta: {},
          finish_reason: "stop"
        }]
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(endChunk)}\n\n`));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}