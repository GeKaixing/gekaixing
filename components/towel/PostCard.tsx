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
export default function PostCard() {
    return (
        <Card className='cursor-pointer hover:bg-gray-50'>
            <CardHeader>
                <div className='flex items-center gap-2 '>
                    <CardTitle className='hover:bg-gray-100'>
                        <Avatar>
                            <AvatarImage src="/logo.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </CardTitle>
                    <CardDescription className='hover:bg-gray-100'>用户名字</CardDescription>
                </div>

                <CardAction>
                    <PostDropdownMenu></PostDropdownMenu>

                </CardAction>
            </CardHeader>
            <CardContent >
                <Link href='/home/status/1'>
                    Lorem ipsum dolor sit, amet consectetur adipisicingelit. Vitae veritatis porro laborum voluptates numquam voluptatem omnis fugit atque officia cupiditate distinctio aspernatur sunt accusamus quibusdam deserunt maxime, laudantium minima cum nobis magni nulla officiis necessitatibus nisi. Earum, mollitia repudiandae debitis recusandae ex dolore magni iure, odio facilis possimus ducimus magnam enim totam commodi itaque delectus fugit, beatae vel corrupti harum sed dolores quisquam sit hic. Assumenda voluptatibus dolorem reiciendis? A culpa laboriosam dignissimos quos beatae eum tempora nulla, magni corrupti ipsa sint sequi consequuntur, quaerat voluptatum velit debitis cumque ut? In repudiandae odit cupiditate dolores ipsa dignissimos, eaque reiciendis eligendi?
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
                    <li className='flex gap-2'>
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
