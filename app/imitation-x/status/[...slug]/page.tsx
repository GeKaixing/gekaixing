'use server'
import React from 'react'
import PostRetreat from '@/components/gekaixing/PostRetreat';
import PublishReply from '@/components/gekaixing/PublishReply'
import Reply from '@/components/gekaixing/Reply';
import StatusStore from '@/components/gekaixing/StatusStore';

export interface Author {
    id: string
    email: string
    name: string | null
    avatar: string | null
    backgroundImage: string | null
    briefIntroduction: string | null
    createdAt: string
    updatedAt: string
}
export interface PostNode {
    id: string
    content: string
    createdAt: string
    updatedAt: string
    authorId: string
    parentId: string | null
    rootId: string | null
    likeCount: number
    replyCount: number
    author: Author
    replies: PostNode[]   // 🌳 递归结构
}
export interface ApiResponse<T> {
    data: T
    success: boolean
}
export type PostDetailResponse = ApiResponse<PostNode>

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params
        const result = await fetch(`http://localhost:3000/api/post/?id=${slug[0]}`);
        const data: PostDetailResponse = await result.json();
        console.log(data)
        return (
            <div className='space-y-4'>
                {/* 头部 */}
                <PostRetreat></PostRetreat>
                {/* post卡片 */}
                <StatusStore data={data.data}></StatusStore>
                {/* reply回复 */}
                <PublishReply postId={data.data.id} reply_id={data.data.id} id={data.data.id} post_id={data.data.id} type={'post'} ></PublishReply>
               <Reply post_id={data.data.id} type={'reply_id'} />
            </div>
        );
    } catch (e) {
        console.error('加载帖子出错:', e)
        return <div>加载失败</div>
    }

}



