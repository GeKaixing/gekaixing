"use client"

import React from 'react'
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


async function likePost(id: string, currentLike: number) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('post')
        .update({ like: currentLike + 1 })
        .eq('id', id)
        .select();

    if (error) {
        console.error('点赞失败', error.message)
    } else {
        console.log('点赞成功', data)
    }
}

async function starPost(id: string, currentLike: number) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('post')
        .update({ star: currentLike + 1 })
        .eq('id', id)
        .select();

    if (error) {
        console.error('点赞失败', error.message)
    } else {
        console.log('点赞成功', data)
    }
}
async function sharePost(id: string, currentLike: number) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('post')
        .update({ share: currentLike + 1 })
        .eq('id', id)
        .select();

    if (error) {
        console.error('点赞失败', error.message)
    } else {
        console.log('点赞成功', data)
    }
}

export default function PostCard({
    id,
    user_id,
    user_name,
    user_avatar,
    user_email,
    content,
    like,
    star,
    reply,
    share,
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


    return (
        <Card className='cursor-pointer hover:bg-gray-50'>
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
                    <PostDropdownMenu id={id} user_id={user_id}></PostDropdownMenu>
                </CardAction>
            </CardHeader>
            <CardContent >
                <Link href={`/home/status/${id}`}>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </Link>
            </CardContent>
            <CardFooter>
                <ul className='flex justify-between items-center w-full'>
                    <li className='flex gap-2 hover:text-blue-400 ' onClick={() => {
                        likePost(id, like)
                    }} >
                        <div className='w-7 h-7 flex justify-center items-center rounded-full hover:bg-blue-400/10'>
                            <Heart></Heart>
                        </div>
                        {like || 0}
                    </li>
                    <Link href={`/home/status/${id}`} className='flex gap-2 hover:text-green-400'>
                        <div className='w-7 h-7 flex justify-center items-center  rounded-full hover:bg-green-400/10'>
                            <MessageCircleMore />
                        </div>
                        {reply || 0}
                    </Link>
                    <li className='flex gap-2 hover:text-red-400'
                        onClick={() => {
                            starPost(id, star)
                        }}
                    >
                        <div className='w-7 h-7 flex justify-center items-center  rounded-full hover:bg-green-400/10'>
                            <Star />
                        </div>
                        {star || 0}
                    </li>
                    <li className='flex gap-2 hover:text-blue-400 '
                        onClick={() => {
                            sharePost(id, share)
                        }}
                    >
                        <div className='w-7 h-7 flex justify-center items-center  rounded-full hover:bg-blue-400/10'>
                            <Share2 />
                        </div>
                        {share || 0}
                    </li>
                </ul>

            </CardFooter>
        </Card>
    )
}
