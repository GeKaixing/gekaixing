"use client"
import { postStore } from '@/store/post'
import { useEffect } from 'react'
import PostList from './PostList'
import { PostNode } from '@/app/imitation-x/status/[...slug]/page'

export default function StatusStore({ data }: { data: PostNode }) {

    const i=[data]
    useEffect(() => {
        postStore.getState().setPosts(i)
    }, [data])

    return (
        <PostList />
    )
}
