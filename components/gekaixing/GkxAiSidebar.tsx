"use client"

import Link from "next/link"
import { MessageSquare, Plus, Trash2 } from "lucide-react"
import { AiSession, useAiSessions } from "@/store/AiSessions"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export default function GkxAiSidebar({
  sessions,
  userId: _userId,
}: {
  sessions: AiSession[]
  userId: string
}) {
  const t = useTranslations("ImitationX.Gkx")
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
    removeSession,
  } = useAiSessions()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // 同步 sessions 到 store
  useEffect(() => {
    setSessions(sessions)
  }, [sessions, setSessions])

  const handleNewSession = () => {
    router.push(`/imitation-x/gkx`)
  }

  async function handleDeleteSession(sessionId: string): Promise<void> {
    if (deletingId) return
    setDeletingId(sessionId)

    try {
      const res = await fetch("/api/chat/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })

      if (!res.ok) {
        throw new Error(t("deleteFailed"))
      }

      removeSession(sessionId)
      toast.success(t("deleteSuccess"))

      if (isActiveSession(sessionId)) {
        router.push("/imitation-x/gkx")
      }
    } catch (error) {
      console.error(t("deleteFailed"), error)
      toast.error(t("deleteFailedRetry"))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="border border-border rounded-2xl bg-background">
      {/* 新对话按钮 */}
      <div className="p-3">
        <button
          onClick={handleNewSession}
          className="w-full flex items-center gap-2 justify-center border border-border rounded-xl py-2.5 text-sm font-semibold hover:bg-muted/60 transition-all"
        >
          <Plus size={16} strokeWidth={3} />
          <span>{t("newChat")}</span>
        </button>
      </div>

      {/* 历史记录 */}
      <div className="max-h-[360px] overflow-y-auto px-2 pb-3 space-y-1 custom-scrollbar">
        <div className="px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          {t("history")}
        </div>

        {storeSessions.length === 0 ? (
          <div className="px-3 py-8 text-center text-xs text-muted-foreground italic">
            {t("emptyHistory")}
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
                <div
                  key={session.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all group overflow-hidden border border-transparent",
                    "hover:bg-muted/60 hover:text-foreground",
                    isHighlight
                      ? "bg-muted text-foreground border-border"
                      : "text-muted-foreground"
                  )}
                >
                  <Link
                    href={`/imitation-x/gkx/${session.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <MessageSquare
                      size={14}
                      className="shrink-0 opacity-60 group-hover:opacity-100"
                    />
                    <span className="truncate flex-1">
                      {session.title || t("untitled")}
                    </span>
                  </Link>

                  <button
                    type="button"
                    aria-label={t("deleteSession")}
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      void handleDeleteSession(session.id)
                    }}
                    disabled={deletingId === session.id}
                    className={cn(
                      "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-opacity",
                      "opacity-0 group-hover:opacity-100",
                      "hover:bg-destructive/10 hover:text-destructive",
                      deletingId === session.id && "opacity-100 cursor-not-allowed"
                    )}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })
        )}
      </div>
    </div>
  )
}
