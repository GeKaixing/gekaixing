'use server'
import PostCard from '@/components/towel/PostCard'
import React from 'react'
import PostRetreat from '@/components/towel/PostRetreat';
import PublishReply from '@/components/towel/PublishReply'
import Reply from '@/components/towel/Reply';


export default async function Page({ params }: { params: { slug?: string[] } }) {
    const id = params.slug?.[0] ? params.slug[0]:null
    return (
        id ?<Post params={id} />:<div>发生错误</div>
    );
}


async function Post({ params }: { params: string }) {
    const result = await fetch(`http://localhost:3000/api/post/?id=${params}`,);
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
                    reply={data.data[0].reply}
                    share={data.data[0].share}

                />
                <PublishReply post_id={data.data[0].id}></PublishReply>
                <Reply post_id={data.data[0].id} type={'post_id'} />

            </div>
        )
    } else {
        return null
    }
}



