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
export default function PostCard({
    id,
    user_id,
    user_name,
    user_avatar,
    user_email,
    content,
}: {
    id: string,
    user_id: string,
    user_name: string,
    user_email: string,
    user_avatar: string,
    content: string
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
                <Link href='/home/status/1'>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </Link>
            </CardContent>
            <CardFooter>
                <ul className='flex justify-between items-center w-full'>
                    <li className='flex gap-2'>
                        <Heart></Heart>
                        0
                    </li>
                    <li className='flex gap-2'>
                        <MessageCircleMore />
                        0
                    </li>
                    <li className='flex gap-2'><div dangerouslySetInnerHTML={{ __html: content }} />
                        <Star />
                        0
                    </li>
                    <li className='flex gap-2'>
                        <Share2 />
                        0
                    </li>
                </ul>

            </CardFooter>
        </Card>
    )
}
