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

async function getFeed(userId: string): Promise<Post[]> {
    const posts = await prisma.post.findMany({
        where: {
            authorId: userId,
            parentId: null,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 20,

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

            // ✅ 统计数量（数据库 count）
            _count: {
                select: {
                    likes: true,
                    bookmarks: true,
                    shares: true,
                    replies: true,
                },
            },

            // ✅ 只查当前用户是否点赞
            likes: userId
                ? {
                    where: { userId },
                    select: { id: true },
                }
                : false,

            bookmarks: userId
                ? {
                    where: { userId },
                    select: { id: true },
                }
                : false,

            shares: userId
                ? {
                    where: { userId },
                    select: { id: true },
                }
                : false,
        },
    });

    // 格式化输出
    const result = posts.map((post) => ({
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
    }));

    return result;

}

async function getUserReplies(userId: string): Promise<Post[]> {

    const replies = await prisma.post.findMany({
        where: {
            authorId: userId,
            parentId: {
                not: null,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
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
            parent: {
                select: {
                    id: true,
                    content: true,
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
            // ✅ 只查当前用户是否点赞
            likes: userId
                ? {
                    where: { userId },
                    select: { id: true },
                }
                : false,

            bookmarks: userId
                ? {
                    where: { userId },
                    select: { id: true },
                }
                : false,

            shares: userId
                ? {
                    where: { userId },
                    select: { id: true },
                }
                : false,
        },
    });

    return replies.map((post) => ({
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

        parentContent: post.parent?.content, // 👈 可以显示“回复了谁”
    }));
}

async function getLikedPosts(userId: string): Promise<Post[]> {

    const replies = await prisma.post.findMany({
        where: {
            parentId: null, // ✅ 只查主帖
            likes: {
                some: {
                    userId: userId, // ✅ 用户点赞过
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
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
            parent: {
                select: {
                    id: true,
                    content: true,
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
            // ✅ 只查当前用户是否点赞
            likes: userId
                ? {
                    where: { userId },
                    select: { id: true },
                }
                : false,

            bookmarks: userId
                ? {
                    where: { userId },
                    select: { id: true },
                }
                : false,

            shares: userId
                ? {
                    where: { userId },
                    select: { id: true },
                }
                : false,
        },
    });

    return replies.map((post) => ({
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

        parentContent: post.parent?.content, // 👈 可以显示“回复了谁”
    }));
}

async function getBookmarkPosts(userId: string): Promise<Post[]> {


    const replies = await prisma.post.findMany({
        where: {
            parentId: null, // ✅ 只查主帖
            bookmarks: {
                some: {
                    userId: userId, // ✅ 用户点赞过
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
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
            parent: {
                select: {
                    id: true,
                    content: true,
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
            // ✅ 只查当前用户是否点赞
            likes: userId
                ? {
                    where: { userId },
                    select: { id: true },
                }
                : false,

            bookmarks: userId
                ? {
                    where: { userId },
                    select: { id: true },
                }
                : false,

            shares: userId
                ? {
                    where: { userId },
                    select: { id: true },
                }
                : false,
        },
    });

    return replies.map((post) => ({
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

        parentContent: post.parent?.content, // 👈 可以显示“回复了谁”
    }));
}



async function getUserInfo(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    })
    return user
}


export default async function Page({ params }: { params: Promise<{ id: string[] }> }) {
    const t = await getTranslations("ImitationX.Profile")
    const { id } = await params

    const userId = id[0]

    const posts = await getFeed(userId);

    const replies = await getUserReplies(userId);

    const liked = await getLikedPosts(userId);

    const bookmark = await getBookmarkPosts(userId);

    const user = await getUserInfo(userId)


    return (
        <div >
            <div className='h-16'> <ArrowLeftBack></ArrowLeftBack></div>
            <User_background_image backgroundImage={user?.backgroundImage} />
            <div className='px-4'>

                <User_background_bio
                    name={user?.name}
                    avatar={user?.avatar}
                    briefIntroduction={user?.briefIntroduction}
                    userId={user?.id}
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
                        <PostStore data={posts} />
                    </TabsContent>
                    <TabsContent value="reply" className='flex flex-col gap-6'>
                        <PostStore data={replies} />
                    </TabsContent>
                    {/* <TabsContent value="article" className='flex flex-col gap-6'>    <PostCard></PostCard></TabsContent>*/}
                    <TabsContent value="like" className='flex flex-col gap-6'>
                        <PostStore data={liked} />
                    </TabsContent>
                    <TabsContent value="bookmark" className='flex flex-col gap-6'>    <PostStore data={bookmark} /></TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

