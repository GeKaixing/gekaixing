import Link from "next/link"
import { AtSign } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import ArrowLeftBack from "@/components/gekaixing/ArrowLeftBack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"

type MentionNotification = {
  id: string
  createdAt: Date
  content: string
  threadId: string
  actor: {
    id: string
    name: string | null
    userid: string
    avatar: string | null
  }
}

const MENTION_REGEX = /(^|[^\p{L}\p{N}_@])@([\p{L}\p{N}][\p{L}\p{N}_-]{0,35})/gu

function extractPlainText(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function hasMentionTarget(content: string, targets: Set<string>): boolean {
  const text = extractPlainText(content)

  for (const match of text.matchAll(MENTION_REGEX)) {
    const handle = (match[2] || "").toLowerCase()
    if (handle && targets.has(handle)) {
      return true
    }
  }

  return false
}

function getPreview(content: string): string {
  const text = extractPlainText(content)
  return text.length > 120 ? `${text.slice(0, 120)}...` : text
}

function formatRelativeTime(date: Date, locale: string): string {
  const diffMs = date.getTime() - Date.now()
  const diffSeconds = Math.round(diffMs / 1000)
  const absSeconds = Math.abs(diffSeconds)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  if (absSeconds < 60) {
    return rtf.format(diffSeconds, "second")
  }

  const diffMinutes = Math.round(diffSeconds / 60)
  if (Math.abs(diffMinutes) < 60) {
    return rtf.format(diffMinutes, "minute")
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, "hour")
  }

  const diffDays = Math.round(diffHours / 24)
  if (Math.abs(diffDays) < 30) {
    return rtf.format(diffDays, "day")
  }

  const diffMonths = Math.round(diffDays / 30)
  if (Math.abs(diffMonths) < 12) {
    return rtf.format(diffMonths, "month")
  }

  const diffYears = Math.round(diffMonths / 12)
  return rtf.format(diffYears, "year")
}

async function getMentionNotifications(userId: string, userid: string, name: string | null): Promise<MentionNotification[]> {
  const targets = new Set<string>([userid.toLowerCase()])
  if (name) {
    targets.add(name.toLowerCase())
  }

  const candidates = await prisma.post.findMany({
    where: {
      authorId: { not: userId },
      OR: [
        { content: { contains: `@${userid}`, mode: "insensitive" } },
        ...(name ? [{ content: { contains: `@${name}` } }] : []),
      ],
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      rootId: true,
      parentId: true,
      author: {
        select: {
          id: true,
          name: true,
          userid: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return candidates
    .filter((post) => hasMentionTarget(post.content, targets))
    .map((post) => ({
      id: post.id,
      createdAt: post.createdAt,
      content: post.content,
      threadId: post.rootId || post.parentId || post.id,
      actor: {
        id: post.author.id,
        name: post.author.name,
        userid: post.author.userid,
        avatar: post.author.avatar,
      },
    }))
}

export default async function NotificationsPage() {
  const locale = await getLocale()
  const t = await getTranslations("ImitationX.Notifications")
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div>
        <ArrowLeftBack name={t("title")} />
        <div className="px-4 py-8 text-muted-foreground">{t("empty.mentionsDesc")}</div>
      </div>
    )
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      userid: true,
      name: true,
    },
  })

  if (!currentUser) {
    return (
      <div>
        <ArrowLeftBack name={t("title")} />
        <div className="px-4 py-8 text-muted-foreground">{t("empty.mentionsDesc")}</div>
      </div>
    )
  }

  const notifications = await getMentionNotifications(currentUser.id, currentUser.userid, currentUser.name)

  return (
    <div className="min-h-screen">
      <ArrowLeftBack name={t("title")} />

      <div className="border-b border-border px-4 pb-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          <AtSign className="h-4 w-4" />
          {t("tabs.mentions")}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <AtSign className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-foreground">{t("empty.mentionsTitle")}</h3>
          <p className="max-w-sm text-center text-muted-foreground">{t("empty.mentionsDesc")}</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {notifications.map((notification) => (
            <div key={notification.id} className="border-b border-border p-4 transition-colors hover:bg-accent/50">
              <div className="flex items-start gap-3">
                <div className="pt-1 text-blue-500">
                  <AtSign className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={notification.actor.avatar || ""} />
                      <AvatarFallback className="text-xs">
                        {(notification.actor.name || notification.actor.userid).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <Link href={`/imitation-x/user/${notification.actor.id}`} className="font-semibold hover:underline">
                      {notification.actor.name || notification.actor.userid}
                    </Link>
                    <span className="text-muted-foreground">@{notification.actor.userid}</span>
                    <span className="text-foreground">{t("actions.mention")}</span>
                    <span className="text-sm text-muted-foreground">· {formatRelativeTime(notification.createdAt, locale)}</span>
                  </div>

                  <Link href={`/imitation-x/status/${notification.threadId}`} className="mt-2 block rounded-xl border border-border bg-muted/40 p-3">
                    <p className="line-clamp-3 text-sm text-foreground">{getPreview(notification.content)}</p>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
