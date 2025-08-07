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
import { replyStore } from '@/store/reply'
import { copyToClipboard } from '@/utils/function/copyToClipboard'
import { createClient } from '@/utils/supabase/client'
import { userStore } from '@/store/user'
async function likePost(id: string, newLike: number) {
    const supabase = createClient()
    const { error } = await supabase
        .from('reply')
        .update({ like: newLike })
        .eq('id', id)

    return !error
}

async function starPost(id: string, newStar: number) {
    const supabase = createClient()
    const { error } = await supabase
        .from('reply')
        .update({ star: newStar })
        .eq('id', id)

    return !error
}

async function sharePost(id: string, newShare: number) {
    const supabase = createClient()
    const { error } = await supabase
        .from('reply')
        .update({ share: newShare })
        .eq('id', id)

    return !error
}
export default function ReplyCard({
    post_id,
    id,
    reply_id: initialReply_id,
    user_id,
    user_name,
    user_email,
    user_avatar,
    content,
    like: initialLike,
    star: initialStar,
    reply_count: initialReply_count,
    share: initialShare,
}: {
    reply_id: string | null
    post_id: string,
    id: string,
    user_id: string,
    user_name: string,
    user_email: string,
    user_avatar: string,
    content: string,
    like: number,
    star: number,
    reply_count: number,
    share: number
}) {
    const post = replyStore(state => state.replys.find(p => p.id === id))
    const updatePost = replyStore(state => state.updateReply)

    if (!post) return null

    const { like, star, share, reply_count, reply_id } = post

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
            copyToClipboard('https://www.gekaixing.top/home/reply/' + id)
        }
    }
    return (
        <Card className='cursor-pointer hover:bg-gray-50' key={id}>
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
                    <PostDropdownMenu
                        reply_id={reply_id}
                        type='reply'
                        post_id={post_id}
                        id={id}
                        user_id={user_id}
                        content={content}>
                    </PostDropdownMenu>
                </CardAction>
            </CardHeader>
            <CardContent >
                <Link href={`/home/reply/${id}`}>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                </Link>
            </CardContent>
            {userStore.getState().id && <CardFooter>
                <ul className='flex justify-between items-center w-full'>
                    <li className='flex gap-2 hover:text-blue-400 ' onClick={handleLike}>
                        <div className='w-7 h-7 flex justify-center items-center rounded-full hover:bg-blue-400/10'>
                            <Heart />
                        </div>
                        {like || 0}
                    </li>
                    <Link href={`/home/reply/${id}`} className='flex gap-2 hover:text-green-400'>
                        <div className='w-7 h-7 flex justify-center items-center rounded-full hover:bg-green-400/10'>
                            <MessageCircleMore />
                        </div>
                        {reply_count || 0}
                    </Link>
                    <li className='flex gap-2 hover:text-red-400' onClick={handleStar}>
                        <div className='w-7 h-7 flex justify-center items-center rounded-full hover:bg-green-400/10'>
                            <Star />
                        </div>
                        {star || 0}
                    </li>
                    <li className='flex gap-2 hover:text-blue-400' onClick={handleShare}>
                        <div className='w-7 h-7 flex justify-center items-center rounded-full hover:bg-blue-400/10'>
                            <Share2 />
                        </div>
                        {share || 0}
                    </li>
                </ul>

            </CardFooter>}
        </Card>
    )
}
