"use client"

import React from "react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type MessageRole = "user" | "assistant" | "system"

interface MessageBubbleProps {
  role: MessageRole
  content: string
  loading?: boolean
}

export function MessageBubble({
  role,
  content,
  loading = false,
}: MessageBubbleProps) {
  const isUser = role === "user"

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words",
          "transition-all duration-200",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {/* loading 状态 */}
        {loading ? <TypingIndicator /> : <MarkdownContent content={content} />}
      </div>
    </div>
  )
}

export default MessageBubble

// =======================
// Markdown 渲染
// =======================

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code(props) {
          const { className, children } = props
          const isInline = !className

          if (isInline) {
            return (
              <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-xs">
                {children}
              </code>
            )
          }

          return (
            <pre className="p-3 rounded-lg overflow-x-auto bg-black/90 text-white text-xs">
              <code>{children}</code>
            </pre>
          )
        },
        a(props) {
          return (
            <a
              {...props}
              target="_blank"
              className="underline opacity-80 hover:opacity-100"
            />
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

// =======================
// 打字动画（AI生成中）
// =======================

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center h-5">
      <span className="w-2 h-2 rounded-full bg-current animate-bounce" />
      <span className="w-2 h-2 rounded-full bg-current animate-bounce delay-150" />
      <span className="w-2 h-2 rounded-full bg-current animate-bounce delay-300" />
    </div>
  )
}