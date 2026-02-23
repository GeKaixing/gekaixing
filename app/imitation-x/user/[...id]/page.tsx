'use server'
import ArrowLeftBack from '@/components/gekaixing/ArrowLeftBack'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { prisma } from '@/lib/prisma'
import { Post } from '../../page'
import PostStore from '@/components/gekaixing/PostStore'
import User_background_image from '@/components/gekaixing/User_background_image'
import User_background_bio from '@/components/gekaixing/User_background_bio'
import { revalidatePath } from 'next/cache'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { createClient } from "@/utils/supabase/server"
import { Prisma } from '@/generated/prisma/client'

const PROFILE_LIST_LIMIT = 20
type FeedScope = "user-posts" | "user-replies" | "user-liked" | "user-bookmarks"

type FeedPage = {
    data: Post[]
    page: {
        nextCursor: string | null
        hasMore: boolean
    }
}

function getSiteUrl(): string {
    const envUrl = process.env.NEXT_PUBLIC_URL
    if (envUrl && envUrl.startsWith('http')) {
        return envUrl
    }
    return 'https://www.gekaixing.top'
}

function buildBioDescription(text: string | null): string {
    const normalized = (text || '').replace(/\s+/g, ' ').trim()
    if (!normalized) {
        return '查看该用户的帖子、回复与收藏内容。'
    }
    return normalized.slice(0, 120)
}

function getProfileCopy(locale: string) {
    if (locale === "zh-CN") {
        return {
            defaultDescription: "查看该用户的帖子、回复与收藏内容。",
            pageTitle: "个人主页 | Gekaixing",
            pageDescription: "查看用户主页、帖子和互动记录。",
            notFoundTitle: "用户不存在 | Gekaixing",
            notFoundDescription: "该用户可能已被删除或不可见。",
            titleTemplate: (displayName: string) => `${displayName} 的个人主页 | Gekaixing`,
        }
    }

    return {
        defaultDescription: "View this user's posts, replies and bookmarks.",
        pageTitle: "Profile | Gekaixing",
        pageDescription: "Browse the user's profile, posts and interactions.",
        notFoundTitle: "User Not Found | Gekaixing",
        notFoundDescription: "This user may have been removed or is not available.",
        titleTemplate: (displayName: string) => `${displayName}'s profile | Gekaixing`,
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string[] }>
}): Promise<Metadata> {
    const locale = await getLocale()
    const copy = getProfileCopy(locale)
    const { id } = await params
    const userId = id?.[0]
    const siteUrl = getSiteUrl()

    if (!userId) {
        return {
            title: copy.pageTitle,
            description: copy.pageDescription,
        }
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            userid: true,
            briefIntroduction: true,
            avatar: true,
        },
    })

    if (!user) {
        return {
            title: copy.notFoundTitle,
            description: copy.notFoundDescription,
        }
    }

    const displayName = user.name || `@${user.userid}`
    const title = copy.titleTemplate(displayName)
    const description = buildBioDescription(user.briefIntroduction) || copy.defaultDescription
    const url = `${siteUrl}/imitation-x/user/${user.id}`

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
            type: 'profile',
            siteName: 'Gekaixing',
            images: user.avatar
                ? [
                    {
                        url: user.avatar,
                        alt: `${displayName} avatar`,
                    },
                ]
                : undefined,
        },
        twitter: {
            card: 'summary',
            title,
            description,
            images: user.avatar ? [user.avatar] : undefined,
        },
    }
}

function buildWhere(scope: FeedScope, targetId: string): Prisma.PostWhereInput {
    switch (scope) {
        case "user-posts":
            return {
                authorId: targetId,
                parentId: null,
            }
        case "user-replies":
            return {
                authorId: targetId,
                parentId: { not: null },
            }
        case "user-liked":
            return {
                parentId: null,
                likes: {
                    some: {
                        userId: targetId,
                    },
                },
            }
        case "user-bookmarks":
            return {
                parentId: null,
                bookmarks: {
                    some: {
                        userId: targetId,
                    },
                },
            }
        default:
            return {
                parentId: null,
            }
    }
}

async function getScopedFeed(scope: FeedScope, targetId: string, viewerId: string | undefined): Promise<FeedPage> {
    try {
        const rows = await prisma.post.findMany({
            where: buildWhere(scope, targetId),
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take: PROFILE_LIST_LIMIT + 1,
            select: {
                id: true,
                content: true,
                createdAt: true,
                likeCount: true,
                starCount: true,
                shareCount: true,
                replyCount: true,
                author: {
                    select: {
                        id: true,
                        userid: true,
                        name: true,
                        avatar: true,
                        isPremium: true,
                    },
                },
                likes: viewerId
                    ? {
                        where: { userId: viewerId },
                        select: { id: true },
                    }
                    : false,
                bookmarks: viewerId
                    ? {
                        where: { userId: viewerId },
                        select: { id: true },
                    }
                    : false,
                shares: viewerId
                    ? {
                        where: { userId: viewerId },
                        select: { id: true },
                    }
                    : false,
            },
        })

        const hasMore = rows.length > PROFILE_LIST_LIMIT
        const posts = hasMore ? rows.slice(0, PROFILE_LIST_LIMIT) : rows
        const nextCursor = hasMore ? posts[posts.length - 1]?.id ?? null : null

        return {
            data: posts.map((post) => ({
                id: post.id,
                content: post.content,
                createdAt: post.createdAt,
                user_id: post.author.id,
                user_name: post.author.name,
                user_avatar: post.author.avatar,
                user_userid: post.author.userid,
                isPremium: post.author.isPremium,
                like: post.likeCount,
                star: post.starCount,
                share: post.shareCount,
                reply: post.replyCount,
                likedByMe: post.likes?.length > 0,
                bookmarkedByMe: post.bookmarks?.length > 0,
                sharedByMe: post.shares?.length > 0,
            })),
            page: {
                nextCursor,
                hasMore,
            },
        }
    } catch (error) {
        console.error(`getScopedFeed failed for ${scope}:`, error)
        return {
            data: [],
            page: {
                nextCursor: null,
                hasMore: false,
            },
        }
    }
}



async function getUserInfo(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                },
            },
        },
    })
    return user
}


export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
    const t = await getTranslations("ImitationX.Profile")
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    const { id } = await params

    const userId = id[0]

    const [postsPage, repliesPage, likedPage, bookmarkPage] = await Promise.all([
        getScopedFeed("user-posts", userId, currentUser?.id),
        getScopedFeed("user-replies", userId, currentUser?.id),
        getScopedFeed("user-liked", userId, currentUser?.id),
        getScopedFeed("user-bookmarks", userId, currentUser?.id),
    ])

    const user = await getUserInfo(userId)
    const isOwner = currentUser?.id === user?.id


    return (
        <div >
            <div className='h-16'> <ArrowLeftBack></ArrowLeftBack></div>
            <User_background_image backgroundImage={user?.backgroundImage} />
            <div className='px-4'>

                <User_background_bio
                    name={user?.name}
                    avatar={user?.avatar}
                    briefIntroduction={user?.briefIntroduction}
                    viewedUserid={user?.userid}
                    followers={user?._count.followers}
                    following={user?._count.following}
                    isOwner={isOwner}
                    isPremium={user?.isPremium || false}
                />

                <Tabs defaultValue="post" className="w-full">
                    <TabsList className='w-full'>
                        <TabsTrigger value="post">{t("tabs.posts")}</TabsTrigger>
                        <TabsTrigger value="reply">{t("tabs.replies")}</TabsTrigger>
                        {/* <TabsTrigger value="article">文章</TabsTrigger>*/}
                        <TabsTrigger value="like">{t("tabs.likes")}</TabsTrigger>
                        <TabsTrigger value="bookmark">{t("tabs.bookmarks")}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="post" className='flex flex-col gap-6'>
                        <PostStore
                            data={postsPage.data}
                            nextCursor={postsPage.page.nextCursor}
                            hasMore={postsPage.page.hasMore}
                            feedQuery={{ scope: "user-posts", targetId: userId }}
                        />
                    </TabsContent>
                    <TabsContent value="reply" className='flex flex-col gap-6'>
                        <PostStore
                            data={repliesPage.data}
                            nextCursor={repliesPage.page.nextCursor}
                            hasMore={repliesPage.page.hasMore}
                            feedQuery={{ scope: "user-replies", targetId: userId }}
                        />
                    </TabsContent>
                    {/* <TabsContent value="article" className='flex flex-col gap-6'>    <PostCard></PostCard></TabsContent>*/}
                    <TabsContent value="like" className='flex flex-col gap-6'>
                        <PostStore
                            data={likedPage.data}
                            nextCursor={likedPage.page.nextCursor}
                            hasMore={likedPage.page.hasMore}
                            feedQuery={{ scope: "user-liked", targetId: userId }}
                        />
                    </TabsContent>
                    <TabsContent value="bookmark" className='flex flex-col gap-6'>
                        <PostStore
                            data={bookmarkPage.data}
                            nextCursor={bookmarkPage.page.nextCursor}
                            hasMore={bookmarkPage.page.hasMore}
                            feedQuery={{ scope: "user-bookmarks", targetId: userId }}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
