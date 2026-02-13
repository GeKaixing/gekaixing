"use server"

import ReplyStore from './ReplyStore'

type Props = {
  post_id: string
  type: 'post_id' | 'reply_id' | 'id' | 'user_id'
}

export default async function Reply({ post_id, type }: Props) {
  const res = await fetch(` http://localhost:3000/api/reply?id=${post_id}&type=${type}`, {
    next: {
      tags: [`reply:${type}:${post_id}`],
    },
  })

  if (!res.ok) {
    console.error('Reply fetch failed')
    return null
  }

  const data = await res.json()
  console.log(data.data)
  return <ReplyStore data={data?.data ?? []} />
}
