"use client"
import { replyStore } from '@/store/reply'
import React, { useEffect } from 'react'
import ReplyList from './ReplyList'

type Reply = {
    id: string,
    user_id: string,
    user_name: string,
    user_email: string,
    user_avatar: string,
    post_id:string;
    content: string
    like: number,
    star: number,
    reply_count: number,
    share: number
    reply_id: string | null
}
export default function ReplyStore({ data }: { data: Reply[] }) {
    useEffect(() => {
        replyStore.getState().setPosts(data)
    }, [data])
    return (
        <ReplyList></ReplyList>
    )
}
