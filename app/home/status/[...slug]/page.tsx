'use server'
import PostCard from '@/components/towel/PostCard'
import React from 'react'
import PostRetreat from '@/components/towel/PostRetreat';
import PublishReply from '@/components/towel/PublishReply'
import Reply from '@/components/towel/Reply';


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params
        const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/?id=${slug[0]}`);
        const data = await result.json();
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
        );
    } catch (e) {
        console.error('加载帖子出错:', e)
        return <div>加载失败</div>
    }

}



