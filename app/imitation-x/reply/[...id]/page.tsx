import PostCard from '@/components/gekaixing/PostCard'
import PostRetreat from '@/components/gekaixing/PostRetreat'
import PostStore from '@/components/gekaixing/PostStore'
import PublishReply from '@/components/gekaixing/PublishReply'
import Reply from '@/components/gekaixing/Reply'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/reply/?id=${id}&type=id`, {
        next: {
            tags: [`reply:id:${id}`],
        },
    })

    const data = await result.json()
    return (
        <div className='space-y-4'>
            <PostRetreat></PostRetreat>
            {/* 二级 reply使用card的样式  */}
            <PostStore data={data.data}></PostStore>
            <PublishReply id={data.data[0].id} post_id={data.data[0].post_id} reply_id={data.data[0].id} type={'reply'} ></PublishReply>
            <Reply post_id={data.data[0].id} type={'reply_id'} />
        </div >
    )

}
