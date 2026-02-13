"use client"
import { postStore, Post } from '@/store/post'
import { useEffect } from 'react'
import PostList from './PostList'
import { PostNode } from '@/app/imitation-x/status/[...slug]/page'

function transformPostNode(node: PostNode): Post {
  return {
    id: node.id,
    user_id: node.user_id,
    user_name: node.user_name || "",
    user_email: node.user_email || "",
    user_avatar: node.user_avatar || "",
    content: node.content,
    like: node.like || 0,
    star: node.star,
    reply_count: node.reply_count || 0,
    share:node.share,
  };
}

export default function StatusStore({ data }: { data: PostNode }) {
  const transformedData = transformPostNode(data);
  const postsArray = [transformedData];

  useEffect(() => {
    postStore.getState().setPosts(postsArray);
  }, [data]);

  return (
    <PostList />
  );
}
