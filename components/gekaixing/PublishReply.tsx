'use client'

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { userStore } from "@/store/user"
import Link from "next/link"
import { replyStore } from "@/store/reply"
import { postStore } from "@/store/post"
import clsx from "clsx"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

async function publishReply(payload: {
    user_id: string
    user_name: string
    user_email: string
    post_id: string
    content: string
    user_avatar: string | null
    reply_id?: string | null
}) {
    const res = await fetch('/api/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    return res.json()
}

type Props = {
    postId: string
    replyId?: string
    userId: string | undefined
    type?: 'post' | 'reply'
}

type MentionUser = {
    id: string
    userid: string
    name: string | null
    avatar: string | null
}

type MentionToken = {
    query: string
    from: number
    to: number
}

function getInputMentionToken(text: string): MentionToken | null {
    const match = /(?:^|[\s(（])@([^\s@]{0,36})$/u.exec(text)
    if (!match) {
        return null
    }

    const raw = match[0]
    const mentionText = raw.startsWith('@') ? raw : raw.slice(1)
    const from = text.length - mentionText.length

    return {
        query: match[1] || "",
        from,
        to: text.length,
    }
}

async function searchUsers(query: string): Promise<MentionUser[]> {
    try {
        const response = await fetch(`/api/user/search?query=${encodeURIComponent(query)}`)
        const data = await response.json()
        if (!data?.success || !Array.isArray(data?.data)) {
            return []
        }
        return data.data as MentionUser[]
    } catch (error) {
        console.error("Failed to search users:", error)
        return []
    }
}

export default function PublishReply({
    postId,
    replyId,
    userId,
    type = 'post',
}: Props) {
    const t = useTranslations("PublishReply")

    const [replyInput, setReplyInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [mentionToken, setMentionToken] = useState<MentionToken | null>(null)
    const [mentionUsers, setMentionUsers] = useState<MentionUser[]>([])

    const { addReply, replaceReply, removeReply } = replyStore()
    const { addReplyCount, subReplyCount } = postStore()

    const {
        email,
        user_avatar,
        name,
        isPremium,
    } = userStore()

    async function handleReply() {
        if (!replyInput.trim() || isLoading || !userId) return

        const tempId = 'temp-' + Date.now()

        const optimisticReply = {
            id: tempId,
            content: replyInput,
            createdAt: new Date(),

            user_id: userId,
            user_name: name || email,
            user_avatar,
            user_userid: userId,
            isPremium,

            like: 0,
            star: 0,
            share: 0,
            reply: 0,

            likedByMe: false,
            bookmarkedByMe: false,
            sharedByMe: false,
        }

        // 🔥 reply 归 replyStore 管
        addReply(optimisticReply)

        // 🔥 post 归 postStore 管
        addReplyCount(postId)

        setReplyInput('')
        setMentionUsers([])
        setMentionToken(null)
        setIsLoading(true)

        try {
            const data = await publishReply({
                user_id: userId,
                user_avatar,
                user_name: name || email,
                user_email: email,
                post_id: postId,
                content: optimisticReply.content,
                reply_id: type === 'reply' ? replyId ?? null : null,
            })

            if (data?.success && data?.data) {
                const real = data.data

                replaceReply(tempId, {
                    ...optimisticReply,
                    id: real.id,
                    createdAt: new Date(real.createdAt),
                })
            } else {
                throw new Error('Publish failed')
            }

        } catch (error) {
            // 回滚
            removeReply(tempId)
            subReplyCount(postId)
        } finally {
            setIsLoading(false)
        }
    }

    function handleReplyInput(value: string): void {
        setReplyInput(value)
        const token = getInputMentionToken(value)
        setMentionToken(token)
    }

    function handleSelectMention(user: MentionUser): void {
        if (!mentionToken) {
            return
        }

        const before = replyInput.slice(0, mentionToken.from)
        const after = replyInput.slice(mentionToken.to)
        setReplyInput(`${before}@${user.userid} ${after}`)
        setMentionUsers([])
        setMentionToken(null)
    }

    useEffect(() => {
        if (!mentionToken) {
            setMentionUsers([])
            return
        }

        const timer = setTimeout(() => {
            void searchUsers(mentionToken.query).then((users) => {
                setMentionUsers(users)
            })
        }, 150)

        return () => {
            clearTimeout(timer)
        }
    }, [mentionToken])

    return (
        <Card className="relative flex w-full flex-row gap-2 p-2 hover:bg-muted/60 transition-colors">
            {userId ? (
                <>
                    <Avatar>
                        <AvatarImage src={user_avatar ?? undefined} />
                        <AvatarFallback>
                            {name?.charAt(0)?.toUpperCase()
                                || email?.charAt(0)?.toUpperCase()
                                || 'U'}
                        </AvatarFallback>
                    </Avatar>

                    <Input
                        value={replyInput}
                        onChange={(e) => handleReplyInput(e.target.value)}
                        className="flex-1"
                        placeholder={t("placeholder")}
                    />

                    <button
                        onClick={handleReply}
                        disabled={!replyInput.trim() || isLoading}
                        className={clsx(
                            'rounded-2xl font-bold h-8 w-[60px] text-primary-foreground bg-muted-foreground/60 flex justify-center items-center transition-colors',
                            { '!bg-primary': replyInput.trim() && !isLoading }
                        )}
                    >
                        {isLoading
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : t("submit")}
                    </button>
                </>
            ) : (
                <Link
                    href="/account"
                    className="rounded-2xl font-bold bg-muted-foreground text-primary-foreground h-8 flex justify-center items-center w-full"
                >
                    {t("loginToReply")}
                </Link>
            )}
            {mentionUsers.length > 0 && mentionToken ? (
                <div className="absolute mt-14 ml-12 max-h-56 w-[320px] overflow-y-auto rounded-md border border-border bg-background shadow-md">
                    {mentionUsers.map((user) => (
                        <button
                            key={user.id}
                            type="button"
                            onClick={() => handleSelectMention(user)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/60"
                        >
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={user.avatar ?? undefined} />
                                <AvatarFallback>{(user.name || user.userid).slice(0, 1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{user.name || user.userid}</span>
                            <span className="text-xs text-muted-foreground">@{user.userid}</span>
                        </button>
                    ))}
                </div>
            ) : null}
        </Card>
    )
}
