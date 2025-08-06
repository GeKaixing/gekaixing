"use server"
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Heart, MessageCircleMore, Share2, Star } from 'lucide-react'
import PostDropdownMenu from './PostDropdownMenu'

export default async function Reply({ post_id, type }: { post_id: string, type: string }) {
    const result = await fetch(`${process.env.URL}/api/reply/?id=${post_id}&type=${type}`, {
        next: {
            tags: [`reply:post_id:${post_id}`],
        },
    })

    const data = await result.json()
    return (
        data.data.lenght !== 0 && data.data.map((items: {
            user_avatar: string,
            user_name: string,
            user_id:string,
            content: string,
            like: string,
            reply: string,
            star: string,
            share: string,
            id: string,
            reply_count:string
        }) => {
            return <Card className='cursor-pointer hover:bg-gray-50' key={items.id}>
                <CardHeader>
                    <div className='flex items-center gap-2 '>
                        <CardTitle className='hover:bg-gray-100'>
                            <Avatar>
                                <AvatarImage src={items.user_avatar} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </CardTitle>
                        <CardDescription className='hover:bg-gray-100'>{items.user_name}</CardDescription>
                    </div>

                    <CardAction>
                        <PostDropdownMenu id={items.id} user_id={items.user_id} content={items.content}></PostDropdownMenu>
                    </CardAction>
                </CardHeader>
                <CardContent >
                    <Link href={`/home/reply/${items.id}`}>
                        <div dangerouslySetInnerHTML={{ __html: items.content }}></div>
                    </Link>
                </CardContent>
                <CardFooter>
                    <ul className='flex justify-between items-center w-full'>
                        <li className='flex gap-2'>
                            <Heart></Heart>
                            {items.like || 0}
                        </li>
                        <li className='flex gap-2'>
                            <MessageCircleMore />
                            {items.reply_count || 0}

                        </li>
                        <li className='flex gap-2'>
                            <Star />
                            {items.star || 0}

                        </li>
                        <li className='flex gap-2'>
                            <Share2 />
                            {items.share || 0}

                        </li>
                    </ul>

                </CardFooter>
            </Card>
        })
    )
}