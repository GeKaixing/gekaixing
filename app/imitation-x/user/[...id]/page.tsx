'use server'
import ArrowLeftBack from '@/components/gekaixing/ArrowLeftBack'
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import UserEditDialog from '@/components/gekaixing/UserEditDialog'
import { userStore } from '@/store/user'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { Post } from '../../page'
import PostStore from '@/components/gekaixing/PostStore'
import User_background_image from '@/components/gekaixing/User_background_image'
import User_background_bio from '@/components/gekaixing/User_background_bio'

async function getFeed(): Promise<Post[]> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id;
    const posts = await prisma.post.findMany({
        where: {
            authorId: userId,
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


export default async function Page() {
    const posts = await getFeed();
    return (
        <div >
            <div className='h-16'> <ArrowLeftBack></ArrowLeftBack></div>
            <User_background_image />
            <div className='px-4'>
                <User_background_bio />
                <Tabs defaultValue="post" className="w-full">
                    <TabsList className='w-full'>
                        <TabsTrigger value="post">帖子</TabsTrigger>
                        <TabsTrigger value="reply">回复</TabsTrigger>
                        {/* <TabsTrigger value="article">文章</TabsTrigger>
                    <TabsTrigger value="media">媒体</TabsTrigger>
                    <TabsTrigger value="like">喜欢</TabsTrigger> */}
                    </TabsList>
                    <TabsContent value="post" className='flex flex-col gap-6'>
                        <PostStore data={posts} />
                    </TabsContent>
                    <TabsContent value="reply" className='flex flex-col gap-6'><PostStore data={posts} /></TabsContent>
                    {/* <TabsContent value="article" className='flex flex-col gap-6'>    <PostCard></PostCard></TabsContent>
                <TabsContent value="media" className='flex flex-col gap-6'>    <PostCard></PostCard></TabsContent>
                <TabsContent value="like" className='flex flex-col gap-6'>    <PostCard></PostCard></TabsContent> */}
                </Tabs>
            </div>
        </div>
    )
}



