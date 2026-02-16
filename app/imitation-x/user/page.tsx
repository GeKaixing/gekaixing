'use client'
import ArrowLeftBack from '@/components/gekaixing/ArrowLeftBack'
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PostCard from '@/components/gekaixing/PostCard'
import Image from 'next/image'
import UserEditDialog from '@/components/gekaixing/UserEditDialog'
import { userStore } from '@/store/user'

async function Postfetch(params: string) {
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/?id=${params}&type=user_id`);
    return result;
}

export default function Page() {
    const [data, setData] = useState([])
    const { id, name, user_background_image, user_avatar, brief_introduction } = userStore()

    useEffect(() => {
        if (!id) return;

        Postfetch(id).then((result) => {
            return result.json()
        }).then((result) => {
            if (result.success) {
                setData(result.data)
            }
        }).catch((e) => {
            console.log(e)
        })
    }, [id])

    return (
        <div >
            <div className='h-16'> <ArrowLeftBack></ArrowLeftBack></div>
            <div className='bg-gray-400 w-full h-[200px] relative'>
                {user_background_image && <Image
                    src={user_background_image}
                    alt="User background"
                    fill
                    priority
                    className='object-cover w-full'  ></Image>}
            </div>
            <div className='px-4'>
                <div>
                    <Avatar className="size-36 absolute  -translate-y-1/2 ">
                        <AvatarImage src={user_avatar} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div className='flex'>
                    <div className='w-full'></div>
                    <UserEditDialog></UserEditDialog>
                </div>
                <div className='w-full h-10'></div>
                <div className='font-bold text-2xl mb-2'>{name}</div>
                {brief_introduction ? <div className='text-sm'>{brief_introduction}</div> : <div className='text-sm'>{"还没有介绍自己"}</div>}
                <div className='w-full h-5'></div>
                <Tabs defaultValue="post" className="w-full">
                    <TabsList className='w-full'>
                        <TabsTrigger value="post">帖子</TabsTrigger>
                        <TabsTrigger value="reply">回复</TabsTrigger>
                    </TabsList>
                    <TabsContent value="post" className='flex flex-col gap-6'>
                        {data.map((items: {
                            id: string,
                            user_id: string,
                            user_name: string,
                            user_avatar: string,
                            user_userid: string,
                            content: string
                            like: number,
                            star: number,
                            reply_count: number,
                            share: number
                        }) => (
                            <PostCard
                                key={items.id}
                                id={items.id}
                                user_id={items.user_id}
                                user_name={items.user_name}
                                user_avatar={items.user_avatar}
                                user_userid={items.user_userid}
                                content={items.content}
                                like={items.like}
                                star={items.star}
                                reply={items.reply_count}
                                share={items.share}
                                isLiked={false}
                                isBookmarked={false}
                            />
                        ))}
                    </TabsContent>
                    <TabsContent value="reply" className='flex flex-col gap-6'>    <UserReplyCard /></TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

async function UserReply(id: string) {
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/reply/?id=${id}&type=user_id`)
    return result;
}

function UserReplyCard() {
    const { id } = userStore()
    const [data, setData] = useState([])

    useEffect(() => {
        if (!id) return;

        UserReply(id).then((result) => {
            return result.json()
        }).then((result) => {
            if (result.success) {
                setData(result.data)
            }
        }).catch((e) => {
            console.log(e)
        })
    }, [id])

    return data.map((items: any) => (
        <PostCard
            key={items.id}
            id={items.id}
            user_id={items.authorId}
            user_name={items.author?.name || ''}
            user_avatar={items.author?.avatar || ''}
            user_userid={items.author?.userid || ''}
            content={items.content}
            like={0}
            star={0}
            reply={0}
            share={0}
            isLiked={false}
            isBookmarked={false}
        />
    ))
}
