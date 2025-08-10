'use server'
import React from 'react'
import PostRetreat from '@/components/gekaixing/PostRetreat';
import PublishReply from '@/components/gekaixing/PublishReply'
import Reply from '@/components/gekaixing/Reply';
import StatusStore from '@/components/gekaixing/StatusStore';


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params
        const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/?id=${slug[0]}`);
        const data = await result.json();
        return (
            <div className='space-y-4'>
                <PostRetreat></PostRetreat>
                <StatusStore data={data.data}></StatusStore>
                <PublishReply id={data.data[0].id} post_id={data.data[0].id} type={'post'} ></PublishReply>
                <Reply post_id={data.data[0].id} type={'post_id'} />
            </div>
        );
    } catch (e) {
        console.error('加载帖子出错:', e)
        return <div>加载失败</div>
    }

}



