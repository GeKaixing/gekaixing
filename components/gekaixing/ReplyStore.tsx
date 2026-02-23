"use client"
import { replyStore } from '@/store/reply'
import { useEffect } from 'react'
import ReplyList from './ReplyList'
import { Post } from '@/app/imitation-x/page'


type ReplyStoreProps = {
  data: Post[]
  nextCursor?: string | null
  hasMore?: boolean
  feedQuery?: Record<string, string>
}

export default function ReplyStore({ data, nextCursor = null, hasMore = false, feedQuery }: ReplyStoreProps) {
  useEffect(() => {
    replyStore.getState().setReplies(data)
  }, [data])
  return (
    <ReplyList
      initialNextCursor={nextCursor}
      initialHasMore={hasMore}
      feedQuery={feedQuery}
    />
  )
}
