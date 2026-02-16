"use client"
import { postStore } from '@/store/post'
import { useEffect, useState } from 'react'
import PostList from './PostList'
import { Post } from '@/app/imitation-x/page'


export default function StatusStore({ data }: { data: Post[] }) {
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    postStore.getState().setPosts(data);
    setIsReady(true)
  }, [data]);

  if (!isReady) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <PostList />
  );
}
