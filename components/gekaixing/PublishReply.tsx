'use client'

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from "../ui/input"
import { useState } from "react"
import { userStore } from "@/store/user"
import Link from "next/link"
import { replyStore } from "@/store/reply"
import { postStore } from "@/store/post"
import clsx from "clsx"
import { Loader2 } from "lucide-react"

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

export default function PublishReply({
    postId,
    replyId,
    userId,
    type = 'post',
}: Props) {

    const [replyInput, setReplyInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { addReply, replaceReply, removeReply } = replyStore()
    const { addReplyCount, subReplyCount } = postStore()

    const {
        email,
        user_avatar,
        name,
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

    return (
        <Card className="flex w-full flex-row gap-2 p-2 hover:bg-muted/60 transition-colors">
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
                        onChange={(e) => setReplyInput(e.target.value)}
                        className="flex-1"
                        placeholder="发表你的回复"
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
                            : '回复'}
                    </button>
                </>
            ) : (
                <Link
                    href="/account"
                    className="rounded-2xl font-bold bg-muted-foreground text-primary-foreground h-8 flex justify-center items-center w-full"
                >
                    请你登录后回复
                </Link>
            )}
        </Card>
    )
}
