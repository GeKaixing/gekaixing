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
    user_avatar: string
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
    id: string
    postId: string
    post_id: string
    replyId?: string
    reply_id:string
    type?: 'post' | 'reply'
}

export default function PublishReply({
    postId,
    replyId,
    type = 'post',
}: Props) {
    const [replyInput, setReplyInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { addReply } = replyStore()

    const {
        email,
        id: userId,
        user_avatar,
        name,
    } = userStore()

    async function handleReply() {
        if (!replyInput.trim() || isLoading) return

        setIsLoading(true)
        try {
            const data = await publishReply({
                user_id: userId,
                user_avatar,
                user_name: name || email,
                user_email: email,
                post_id: postId,
                content: replyInput,
                reply_id: type === 'reply' ? replyId ?? null : null,
            })

            if (data?.success && data?.data) {
                const reply = data.data

                addReply({
                    id: reply.id,
                    content: reply.content,
                    createdAt: reply.createdAt,
                    updatedAt: reply.updatedAt,
                    authorId: reply.authorId,
                    parentId: reply.parentId,
                    rootId: reply.rootId,
                    likeCount: 0,
                    replyCount: 0,
                    shareCount: 0,
                    author: reply.author || {
                        id: reply.authorId,
                        email: '',
                        name: null,
                        avatar: null,
                        backgroundImage: null,
                        briefIntroduction: null,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                })

                postStore.getState().addReplyCount(postId)
                setReplyInput('')
            } else {
                console.error('Failed to publish reply:', data?.error)
            }
        } catch (error) {
            console.error('Error publishing reply:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="flex w-full flex-row p-2 hover:bg-gray-50">
            {userId ? (
                <>
                    <Avatar>
                        <AvatarImage src={user_avatar} />
                        <AvatarFallback>{name?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
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
                            'rounded-2xl font-bold h-8 w-[60px] text-white bg-gray-400 flex justify-center items-center',
                            { '!bg-black': replyInput.trim() && !isLoading }
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            '回复'
                        )}
                    </button>
                </>
            ) : (
                <Link
                    href="/account"
                    className="rounded-2xl font-bold bg-gray-500 text-white h-8 flex justify-center items-center w-full"
                >
                    请你登录后回复
                </Link>
            )}
        </Card>
    )
}
