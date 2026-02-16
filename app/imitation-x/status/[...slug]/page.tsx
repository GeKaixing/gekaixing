'use server'

import PostRetreat from '@/components/gekaixing/PostRetreat'
import PublishReply from '@/components/gekaixing/PublishReply'
import Reply from '@/components/gekaixing/Reply'
import StatusStore from '@/components/gekaixing/StatusStore'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import type { Post } from '../../page'
import PostRetreatServer from '@/components/gekaixing/PostRetreatServer'

/* =======================
   类型定义
======================= */

export type FeedPost = Post & {
    replies: Post[]
}

/* =======================
   获取单个 Post + 子回复
======================= */

const getPost = async (id: string): Promise<FeedPost | null> => {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const userId = user?.id

    const post = await prisma.post.findUnique({
        where: { id },

        include: {
            author: {
                select: {
                    id: true,
                    userid: true,
                    name: true,
                    avatar: true,
                },
            },

            _count: {
                select: {
                    likes: true,
                    bookmarks: true,
                    shares: true,
                    replies: true,
                },
            },

            likes: userId
                ? { where: { userId }, select: { id: true } }
                : false,

            bookmarks: userId
                ? { where: { userId }, select: { id: true } }
                : false,

            shares: userId
                ? { where: { userId }, select: { id: true } }
                : false,

            replies: {
                orderBy: { createdAt: 'asc' },

                include: {
                    author: {
                        select: {
                            id: true,
                            userid: true,
                            name: true,
                            avatar: true,
                        },
                    },

                    _count: {
                        select: {
                            likes: true,
                            bookmarks: true,
                            shares: true,
                            replies: true,
                        },
                    },

                    likes: userId
                        ? { where: { userId }, select: { id: true } }
                        : false,

                    bookmarks: userId
                        ? { where: { userId }, select: { id: true } }
                        : false,

                    shares: userId
                        ? { where: { userId }, select: { id: true } }
                        : false,
                },
            },
        },
    })

    if (!post) return null

    const result: FeedPost = {
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,

        user_id: post.author.id,
        user_name: post.author.name,
        user_avatar: post.author.avatar,
        user_userid: post.author.userid,

        like: post._count.likes,
        star: post._count.bookmarks,
        share: post._count.shares,
        reply: post._count.replies,

        likedByMe: post.likes?.length > 0,
        bookmarkedByMe: post.bookmarks?.length > 0,
        sharedByMe: post.shares?.length > 0,

        replies: post.replies.map((reply) => ({
            id: reply.id,
            content: reply.content,
            createdAt: reply.createdAt,

            user_id: reply.author.id,
            user_name: reply.author.name,
            user_avatar: reply.author.avatar,
            user_userid: reply.author.userid,

            like: reply._count.likes,
            star: reply._count.bookmarks,
            share: reply._count.shares,
            reply: reply._count.replies,

            likedByMe: reply.likes?.length > 0,
            bookmarkedByMe: reply.bookmarks?.length > 0,
            sharedByMe: reply.shares?.length > 0,
        })),
    }

    return result
}

/* =======================
   页面组件
======================= */

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params
    const id = slug[0]

    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const userId = user?.id

    if (!id) {
        notFound()
    }

    const data = await getPost(id)

    if (!data) {
        notFound()
    }

    return (
        <div className="space-y-4 pt-4">
            {/* 返回按钮 */}
            <PostRetreatServer></PostRetreatServer>
            <div className="px-4">
                {/* 主帖子 */}
                <StatusStore data={[data]} />

                <div className="h-4" />

                {/* 回复输入框 */}
                <PublishReply
                    postId={data.id}
                    replyId={data.id}
                    userId={userId}
                    type="post"
                />

                <div className="h-4" />

                {/* 回复列表 */}
                <Reply replies={data.replies ?? []} />
            </div>
        </div>
    )
}
