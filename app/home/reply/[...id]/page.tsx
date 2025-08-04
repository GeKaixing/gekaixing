import PostCard from '@/components/towel/PostCard'
import PostRetreat from '@/components/towel/PostRetreat'
import PublishReply from '@/components/towel/PublishReply'
import Reply from '@/components/towel/Reply'
import React from 'react'

export default async function Page({ params }: { params: { id?: string[] } }) {
    const id = params.id?.[0] && params.id[0]
    const result = await fetch(`http://localhost:3000/api/reply/?id=${id}&type=id`, {
        next: {
            tags: [`reply:id:${id}`],
        },
    })

    const data = await result.json()
    return (
        <div className='space-y-4'>
            <PostRetreat></PostRetreat>
            <PostCard
                id={data.data[0].id}
                user_id={data.data[0].user_id}
                user_name={data.data[0].user_name}
                user_email={data.data[0].user_email}
                user_avatar={data.data[0].user_avatar}
                content={data.data[0].content}
                like={data.data[0].like}
                star={data.data[0].star}
                reply={data.data[0].reply_count}
                share={data.data[0].share}

            />
            <PublishReply post_id={data.data[0].post_id} reply_id={data.data[0].id} type={'reply'} ></PublishReply>
            <Reply post_id={data.data[0].id} type={'reply_id'} />
        </div >
    )

}
