"use client"
import { replyStore } from '@/store/reply'
import React, { useEffect } from 'react'
import ReplyList from './ReplyList'


export interface Author {
  id: string
  email: string
  name: string | null
  avatar: string | null
  backgroundImage: string | null
  briefIntroduction: string | null
  createdAt: string
  updatedAt: string
}

export interface Reply {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  authorId: string
  parentId: string | null
  rootId: string | null
  likeCount: number
  replyCount: number
  shareCount: number
  author: Author
}


export default function ReplyStore({ data }: { data: Reply[] }) {
    useEffect(() => {
        replyStore.getState().setPosts(data)
    }, [data])
    return (
        <ReplyList></ReplyList>
    )
}
