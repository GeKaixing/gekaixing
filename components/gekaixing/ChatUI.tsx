"use client"

import { useEffect, useRef, useState } from "react"
import MessageBubble from "./MessageBubble"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useAiSessions } from "@/store/AiSessions"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  sessionId?: string
}

export default function ChatUI({
  sessionId: initialSessionId,
  userId,
}: {
  sessionId?: string
  userId: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const { addSession } = useAiSessions()

  const bottomRef = useRef<HTMLDivElement>(null)
  const autoSentRef = useRef(false)
  const historyAddedRef = useRef(false) // ⭐ 防止重复加入历史

  const router = useRouter()

  /**
   * ⭐ 首次进入自动发送 ?input=xxx
   */
  useEffect(() => {
    if (!initialSessionId) return
    if (autoSentRef.current) return

    const params = new URLSearchParams(window.location.search)
    const inputParam = params.get("input")

    if (!inputParam) return

    autoSentRef.current = true

    setTimeout(() => {
      sendMessage(inputParam)
    }, 0)

    window.history.replaceState({}, "", window.location.pathname)
  }, [initialSessionId])

  /**
   * 自动滚动
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  /**
   * ⭐ 发送消息
   */
  async function sendMessage(textOverride?: string) {
    const text = textOverride ?? input
    if (!text.trim() || loading) return

    setInput("")
    setLoading(true)

    const assistantId = crypto.randomUUID()

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sessionId: initialSessionId,
      role: "user",
      content: text,
    }

    // ⭐ 用函数式更新避免旧 state
    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage], // 发真实历史
          sessionId: initialSessionId,
          userId,
        }),
      })

      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        fullText += decoder.decode(value)

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: fullText }
              : msg
          )
        )
      }

      /**
       * ⭐ 只有当 session 第一次产生 AI 回复才进历史
       * （用户已经开始和 AI 聊天）
       */
      if (initialSessionId && !historyAddedRef.current) {
        historyAddedRef.current = true

        addSession({
          id: initialSessionId,
          title: text.slice(0, 20) || "新对话",
          userId,
          tokenUsed: fullText.length,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    } catch (error) {
      console.error(error)

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: "出错了，请重试" }
            : msg
        )
      )
    } finally {
      setLoading(false)
    }
  }

  /**
   * Enter 发送
   */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="border-b px-6 py-4 font-semibold">
        AI Assistant
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && <EmptyState />}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            loading={loading && msg.role === "assistant" && !msg.content}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            rows={1}
            className={cn(
              "flex-1 resize-none rounded-xl border px-4 py-3 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
          />

          <button
            onClick={() => {
              // 没 session → 创建 session + 跳转
              if (!initialSessionId) {
                const newSessionId = crypto.randomUUID()

                router.push(
                  `/imitation-x/gkx/${newSessionId}?input=${encodeURIComponent(
                    input
                  )}`
                )
              } else {
                sendMessage()
              }
            }}
            disabled={loading}
            className="px-5 rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      开始和 AI 对话吧 🚀
    </div>
  )
}