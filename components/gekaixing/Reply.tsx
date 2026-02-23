"use server"

import { Post } from '@/app/imitation-x/page'
import ReplyStore from './ReplyStore'

type Replies = {
  replies: Post[]
  nextCursor?: string | null
  hasMore?: boolean
  feedQuery?: Record<string, string>
}

export default async function Reply({ replies, nextCursor = null, hasMore = false, feedQuery }: Replies) {
  if (!replies) {
    console.error('Reply fetch failed')
    return null
  }

  return <ReplyStore data={replies ?? []} nextCursor={nextCursor} hasMore={hasMore} feedQuery={feedQuery} />
}
