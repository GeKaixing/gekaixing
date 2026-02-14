"use client"
import { postStore } from '@/store/post'
import { useEffect } from 'react'
import PostList from './PostList'

type Post = {
  id: string,
  user_id: string,
  user_name: string,
  user_email: string,
  user_avatar: string,
  content: string
  like: number,
  star: number,
  reply_count: number,
  share: number
}

export default function PostStore({ data }: { data: Post[] }) {
  useEffect(() => {
    postStore.getState().setPosts(data)
  }, [data])

  return (
    <PostList />
  )
}
