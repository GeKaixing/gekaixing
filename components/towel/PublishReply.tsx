'use client'
import {
    Card,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from "../ui/input"
import { useState } from "react"
import { userStore } from "@/store/user"
import Link from "next/link"

async function publishReply(
    {
        user_id,
        user_name,
        user_email,
        post_id,
        content,
        user_avatar,
        reply_id,
    }: {
        reply_id: string|number,
        user_id: string,
        user_name: string,
        user_email: string,
        post_id: string|number,
        content: string,
        user_avatar: string
    }) {
    const result = await fetch('/api/reply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            reply_id,
            user_id,
            user_name,
            user_email,
            post_id,
            content,
            user_avatar
        })
    })
    return result;
}

export default function PublishReply({ post_id, reply_id, type = 'post' }: { post_id: string, reply_id?: string, type: string }) {
    const [replyInput, setReplyInput] = useState<string>('');
    const { email,
        id,
        user_avatar,
        name, } = userStore()
    async function handleReply() {
        let result;
        if (type === 'post') {
            result = await publishReply({
                user_id: id,
                user_avatar: user_avatar,
                user_name: name || email,
                user_email: email,
                post_id: post_id,
                content: replyInput,
                reply_id: 0
            });
        } else {
            result = await publishReply({
                user_id: id,
                user_avatar: user_avatar,
                user_name: name || email,
                user_email: email,
                post_id: post_id,
                content: replyInput,
                reply_id: reply_id || 0
            });
        }

        const data = await result.json();
        if (data.success) {
            setReplyInput(''); // Clear the input field after successful reply

        } else {
            console.error('Failed to publish reply:', data.error);
        }
    }

    return (
        <Card className='cursor-pointer hover:bg-gray-50 flex w-full flex-row p-2'>
            {id ?
                <>
                    <Avatar>
                        <AvatarImage src="/logo.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Input onChange={(e) => { setReplyInput(e.target.value) }} value={replyInput} id='replyInput' className='flex-1' placeholder={'发表你的回复'}></Input>
                    <button onClick={handleReply} className='rounded-2xl font-bold bg-gray-500 text-white h-8 w-[60px]'>回复</button>   </> :
                <Link href={'/account'} className='rounded-2xl font-bold bg-gray-500 text-white h-8 flex justify-center items-center w-full'>请你登录后回复</Link>
            }
        </Card>
    )
}