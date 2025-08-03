import PostCard from '@/components/towel/PostCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React, { use } from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'
import { Heart, MessageCircleMore, Share2, Star } from 'lucide-react'
import Input from '@/components/towel/Input'
import PostRetreat from '@/components/towel/PostRetreat';


export default function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
    const resolvedParams = use(params);


    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            {(resolvedParams?.slug ?? [])[0] && <Post params={(resolvedParams?.slug ?? [])[0]} />}
        </React.Suspense>
    )
}


async function Post({ params }: { params: string }) {
    console.log(params)
    const result = await fetch(`http://localhost:3000/api/post/?id=${params}`, {
        method: 'GET',
        cache: 'no-store',
    });
    const data = await result.json();
    console.log(data.success)
    if (data.success) {
        console.log(213213)
        console.log(data.content)
        return (
            <div className='space-y-4'>
                <PostRetreat></PostRetreat>
                <PostCard
                    id={data.id}
                    user_id={data.user_id}
                    user_name={data.user_name}
                    user_email={data.user_email}
                    user_avatar={data.user_avatar}
                    content={data.content}
                />
                <PublishReply></PublishReply>
                {/* {
                data.length !== 0 && data.map((item) => ( */}
                <Reply
                // key={item.id} item={item}
                ></Reply>
                {/* ))
            } */}
            </div>
        )
    } else {
        return null
    }
}



function PublishReply() {
    return (
        <Card className='cursor-pointer hover:bg-gray-50 flex w-full flex-row p-2'>
            <Avatar>
                <AvatarImage src="/logo.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Input id='replyInput' className='flex-1' placeholder={'发表你的回复'}></Input>
            <button className='rounded-2xl font-bold bg-gray-500 text-white h-8 w-[60px]'>回复</button>
        </Card>
    )
}
function Reply() {

    return (<Card className='cursor-pointer hover:bg-gray-50'>
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


            </CardAction>
        </CardHeader>
        <CardContent >
            <Link href='/home/status/2'>
                s, eaque reiciendis eligendi?
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