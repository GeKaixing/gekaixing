"use client"
import { postStore } from '@/store/post'
import { useEffect } from 'react'
import PostList from './PostList'
import { Post } from '@/app/imitation-x/page'

export default function PostStore({ data }: { data: Post[] }) {
  useEffect(() => {
    postStore.getState().setPosts(data)
  }, [data])

  return (
    <PostList />
  )
}
