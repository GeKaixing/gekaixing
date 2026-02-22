"use client"

import Link from "next/link"
import { MessageSquare, Plus } from "lucide-react"
import { AiSession, useAiSessions } from "@/store/AiSessions"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function GkxAiSidebar({
  sessions,
  userId,
}: {
  sessions: AiSession[]
  userId: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  // 判断当前 session 是否 active
  const isActiveSession = (sessionId: string) => {
    return pathname === `/imitation-x/gkx/${sessionId}`
  }

  // store
  const {
    sessions: storeSessions,
    setSessions,
    addSession,
  } = useAiSessions()

  // 同步 sessions 到 store
  useEffect(() => {
    setSessions(sessions)
  }, [sessions, setSessions])

  const handleNewSession = () => {
    router.push(`/imitation-x/gkx`)
  }

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] dark:bg-[#0d0d0d] w-64 border-r border-border">
      {/* 新对话按钮 */}
      <div className="p-4">
        <button
          onClick={handleNewSession}
          className="w-full flex items-center gap-2 justify-center bg-white dark:bg-zinc-900 border border-border rounded-xl py-2.5 text-sm font-semibold hover:bg-secondary/50 transition-all shadow-sm active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={3} />
          <span>新对话</span>
        </button>
      </div>

      {/* 历史记录 */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        <div className="px-3 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          历史记录
        </div>

        {storeSessions.length === 0 ? (
          <div className="px-3 py-10 text-center text-xs text-muted-foreground italic">
            暂无聊天记录
          </div>
        ) : (
          [...storeSessions]
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
            .map((session) => {
              const isActive = isActiveSession(session.id)

              // ⭐ 核心逻辑：只要一个 true 就高亮
              const isHighlight = isActive 

              return (
                <Link
                  key={session.id}
                  href={`/imitation-x/gkx/${session.id}`}
                  className={cn(
                    // 基础样式
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group overflow-hidden",

                    // hover
                    "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:text-foreground",

                    // 状态样式
                    isHighlight
                      ? "bg-blue-100 dark:bg-blue-100/50 text-foreground"
                      : "bg-zinc-200/50 dark:bg-zinc-800/50 text-muted-foreground"
                  )}
                >
                  <MessageSquare
                    size={14}
                    className="shrink-0 opacity-60 group-hover:opacity-100"
                  />

                  <span className="truncate flex-1">
                    {session.title || "无标题对话"}
                  </span>
                </Link>
              )
            })
        )}
      </div>
    </div>
  )
}