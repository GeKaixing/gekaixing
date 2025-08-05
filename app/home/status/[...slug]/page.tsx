'use server'
import PostCard from '@/components/towel/PostCard'
import React from 'react'
import PostRetreat from '@/components/towel/PostRetreat';
import PublishReply from '@/components/towel/PublishReply'
import Reply from '@/components/towel/Reply';


export default async function Page({ params }: {   params: Promise<{ slug: string }> }) {
      const { slug } = await params
    return (
        slug ? <Post params={slug} /> : <div>发生错误</div>
    );
}


async function Post({ params }: { params: string }) {
    const result = await fetch(`  process.env.NEXT_PUBLIC_URL/api/post/?id=${params}`,);
    const data = await result.json();
    if (data.success) {
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
                <PublishReply post_id={data.data[0].id} type={'post'} ></PublishReply>
                <Reply post_id={data.data[0].id} type={'post_id'} />

            </div>
        )
    } else {
        return null
    }
}



