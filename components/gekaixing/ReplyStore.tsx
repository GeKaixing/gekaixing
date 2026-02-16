"use client"
import { replyStore } from '@/store/reply'
import { useEffect } from 'react'
import ReplyList from './ReplyList'
import { Post } from '@/app/imitation-x/page'



export default function ReplyStore({ data }: { data: Post[] }) {
  useEffect(() => {
    replyStore.getState().setReplies(data)
  }, [data])
  return (
    <ReplyList></ReplyList>
  )
}
