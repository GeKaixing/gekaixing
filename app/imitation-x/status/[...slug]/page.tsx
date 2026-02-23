'use server'

import PostRetreat from '@/components/gekaixing/PostRetreat'
import PublishReply from '@/components/gekaixing/PublishReply'
import Reply from '@/components/gekaixing/Reply'
import StatusStore from '@/components/gekaixing/StatusStore'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Post } from '../../page'
import PostRetreatServer from '@/components/gekaixing/PostRetreatServer'
import { getLocale } from 'next-intl/server'
import { Prisma } from '@/generated/prisma/client'

/* =======================
   类型定义
======================= */

export type FeedPost = Post & {
    replies?: Post[]
}

type FeedPage = {
    data: Post[]
    page: {
        nextCursor: string | null
        hasMore: boolean
    }
}

function buildExcerpt(text: string): string {
    const plainText = text.replace(/\s+/g, ' ').trim()
    return plainText.slice(0, 120)
}

function getStatusCopy(locale: string) {
    if (locale === "zh-CN") {
        return {
            pageTitle: "帖子详情 | Gekaixing",
            pageDescription: "查看 Gekaixing 平台上的帖子详情与回复。",
            notFoundTitle: "帖子不存在 | Gekaixing",
            notFoundDescription: "该帖子可能已被删除或不可见。",
            fallbackDescription: "查看这条帖子内容与评论讨论。",
            titleTemplate: (authorName: string) => `${authorName} 的帖子 | Gekaixing`,
        }
    }

    return {
        pageTitle: "Post Detail | Gekaixing",
        pageDescription: "View post details and replies on Gekaixing.",
        notFoundTitle: "Post Not Found | Gekaixing",
        notFoundDescription: "This post may have been removed or is not available.",
        fallbackDescription: "Read this post and discussion replies.",
        titleTemplate: (authorName: string) => `${authorName}'s post | Gekaixing`,
    }
}

function getSiteUrl(): string {
    const envUrl = process.env.NEXT_PUBLIC_URL
    if (envUrl && envUrl.startsWith('http')) {
        return envUrl
    }
    return 'https://www.gekaixing.top'
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
    const locale = await getLocale()
    const copy = getStatusCopy(locale)
    const { slug } = await params
    const postId = slug?.[0]
    const siteUrl = getSiteUrl()

    if (!postId) {
        return {
            title: copy.pageTitle,
            description: copy.pageDescription,
        }
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
                select: {
                    name: true,
                    userid: true,
                },
            },
        },
    })

    if (!post) {
        return {
            title: copy.notFoundTitle,
            description: copy.notFoundDescription,
        }
    }

    const authorName = post.author.name || `@${post.author.userid}`
    const excerpt = buildExcerpt(post.content)
    const title = copy.titleTemplate(authorName)
    const description = excerpt || copy.fallbackDescription
    const url = `${siteUrl}/imitation-x/status/${post.id}`

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
            siteName: 'Gekaixing',
        },
        twitter: {
            card: 'summary',
            title,
            description,
        },
    }
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
                    isPremium: true,
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
        isPremium: post.author.isPremium,

        like: post._count.likes,
        star: post._count.bookmarks,
        share: post._count.shares,
        reply: post._count.replies,

        likedByMe: post.likes?.length > 0,
        bookmarkedByMe: post.bookmarks?.length > 0,
        sharedByMe: post.shares?.length > 0,
    }

    return result
}

async function getStatusReplies(postId: string, viewerId: string | undefined): Promise<FeedPage> {
    try {
        const rows = await prisma.post.findMany({
            where: {
                parentId: postId,
            } satisfies Prisma.PostWhereInput,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take: 21,
            include: {
                author: {
                    select: {
                        id: true,
                        userid: true,
                        name: true,
                        avatar: true,
                        isPremium: true,
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
                likes: viewerId ? { where: { userId: viewerId }, select: { id: true } } : false,
                bookmarks: viewerId ? { where: { userId: viewerId }, select: { id: true } } : false,
                shares: viewerId ? { where: { userId: viewerId }, select: { id: true } } : false,
            },
        })

        const hasMore = rows.length > 20
        const replies = hasMore ? rows.slice(0, 20) : rows
        const nextCursor = hasMore ? replies[replies.length - 1]?.id ?? null : null

        return {
            data: replies.map((reply) => ({
                id: reply.id,
                content: reply.content,
                createdAt: reply.createdAt,
                user_id: reply.author.id,
                user_name: reply.author.name,
                user_avatar: reply.author.avatar,
                user_userid: reply.author.userid,
                isPremium: reply.author.isPremium,
                like: reply._count.likes,
                star: reply._count.bookmarks,
                share: reply._count.shares,
                reply: reply._count.replies,
                likedByMe: reply.likes?.length > 0,
                bookmarkedByMe: reply.bookmarks?.length > 0,
                sharedByMe: reply.shares?.length > 0,
            })),
            page: {
                nextCursor,
                hasMore,
            },
        }
    } catch (error) {
        console.error("getStatusReplies failed:", error)
        return {
            data: [],
            page: {
                nextCursor: null,
                hasMore: false,
            },
        }
    }
}

/* =======================
   页面组件
======================= */

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {

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
    const replyPage = await getStatusReplies(id, userId)

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
                <Reply
                    replies={replyPage.data}
                    nextCursor={replyPage.page.nextCursor}
                    hasMore={replyPage.page.hasMore}
                    feedQuery={{ scope: "status-replies", targetId: id }}
                />
            </div>
        </div>
    )
}
