"use client"
import { postStore } from '@/store/post'
import { useEffect } from 'react'
import PostList from './PostList'
import { Post } from '@/app/imitation-x/page'

type PostStoreProps = {
  data: Post[]
  nextCursor?: string | null
  hasMore?: boolean
  feedQuery?: Record<string, string>
}

export default function PostStore({ data, nextCursor = null, hasMore = false, feedQuery }: PostStoreProps) {
  useEffect(() => {
    postStore.getState().setPosts(data)
  }, [data])

  return (
    <PostList
      initialNextCursor={nextCursor}
      initialHasMore={hasMore}
      feedQuery={feedQuery}
    />
  )
}
