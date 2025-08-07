"use client"

import React, { useState } from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Heart, MessageCircleMore, Share2, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PostDropdownMenu from './PostDropdownMenu'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { copyToClipboard } from '@/utils/function/copyToClipboard'
import { postStore } from '@/store/post'
import { userStore } from '@/store/user'

async function likePost(id: string, newLike: number) {
    const supabase = createClient()
    const { error } = await supabase
        .from('post')
        .update({ like: newLike })
        .eq('id', id)

    return !error
}

async function starPost(id: string, newStar: number) {
    const supabase = createClient()
    const { error } = await supabase
        .from('post')
        .update({ star: newStar })
        .eq('id', id)

    return !error
}

async function sharePost(id: string, newShare: number) {
    const supabase = createClient()
    const { error } = await supabase
        .from('post')
        .update({ share: newShare })
        .eq('id', id)

    return !error
}

export default function PostCard({
    id,
    user_id,
    user_name,
    user_email,
    user_avatar,
    content,
    like: initialLike,
    star: initialStar,
    reply:initialReply,
    share: initialShare,
}: {
    id: string,
    user_id: string,
    user_name: string,
    user_email: string,
    user_avatar: string,
    content: string,
    like: number,
    star: number,
    reply: number,
    share: number
}) {
    const post = postStore(state => state.posts.find(p => p.id === id))
    const updatePost = postStore(state => state.updatePost)

    if (!post) return null

    const { like, star, share,reply_count } = post

    const handleLike = async () => {
        updatePost(id, { like: like + 1 }) // 乐观更新
        const success = await likePost(id, like + 1)
        if (!success) {
            updatePost(id, { like }) // 回滚
        }
    }

    const handleStar = async () => {
        updatePost(id, { star: star + 1 })
        const success = await starPost(id, star + 1)
        if (!success) {
            updatePost(id, { star })
        }
    }

    const handleShare = async () => {
        updatePost(id, { share: share + 1 })
        const success = await sharePost(id, share + 1)
        if (!success) {
            updatePost(id, { share })
        } else {
            copyToClipboard('https://www.gekaixing.top/home/statua/' + id)
        }
    }

    return (
        <Card className='cursor-pointer hover:bg-gray-50 '>
            <CardHeader>
                <div className='flex items-center gap-2 '>
                    <CardTitle className='hover:bg-gray-100'>
                        <Avatar>
                            <AvatarImage src={user_avatar} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </CardTitle>
                    <CardDescription className='hover:bg-gray-100'>{user_name}</CardDescription>
                </div>

                <CardAction>
                    <PostDropdownMenu  id={id} user_id={user_id} content={content}></PostDropdownMenu>
                </CardAction>
            </CardHeader>
            <CardContent >
                <Link href={`/home/status/${id}`}>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </Link>
            </CardContent>
        {userStore.getState().id&&  <CardFooter>
                <ul className='flex justify-between items-center w-full'>
                    <li className='flex gap-2 hover:text-blue-400 ' onClick={handleLike}>
                        <div className='w-7 h-7 flex justify-center items-center rounded-full hover:bg-blue-400/10'>
                            <Heart />
                        </div>
                        {like||0}
                    </li>
                    <Link href={`/home/status/${id}`} className='flex gap-2 hover:text-green-400'>
                        <div className='w-7 h-7 flex justify-center items-center rounded-full hover:bg-green-400/10'>
                            <MessageCircleMore />
                        </div>
                        {reply_count||0}
                    </Link>
                    <li className='flex gap-2 hover:text-red-400' onClick={handleStar}>
                        <div className='w-7 h-7 flex justify-center items-center rounded-full hover:bg-green-400/10'>
                            <Star />
                        </div>
                        {star||0}
                    </li>
                    <li className='flex gap-2 hover:text-blue-400' onClick={handleShare}>
                        <div className='w-7 h-7 flex justify-center items-center rounded-full hover:bg-blue-400/10'>
                            <Share2 />
                        </div>
                        {share||0}
                    </li>
                </ul>
            </CardFooter>}
        </Card>
    )
}
