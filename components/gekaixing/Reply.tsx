"use server"

import { Post } from '@/app/imitation-x/page'
import ReplyStore from './ReplyStore'

type Replies = {
  replies: Post[]
}

export default async function Reply({ replies }: Replies) {
  console.log(replies)
  if (!replies) {
    console.error('Reply fetch failed')
    return null
  }

  return <ReplyStore data={replies?? []} />
}
