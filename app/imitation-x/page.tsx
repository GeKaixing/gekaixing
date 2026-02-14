'use server';
import PostStore from "@/components/gekaixing/PostStore";

type FeedPost = {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string | null
    avatar: string | null
  }
  likeCount: number
  bookmarkCount: number
  shareCount: number
  repliesCount: number
  likedByMe: boolean
  bookmarkedByMe: boolean
  sharedByMe: boolean
}

type Post = {
  id: string
  user_id: string
  user_name: string
  user_email: string
  user_avatar: string
  content: string
  like: number
  star: number
  reply_count: number
  share: number
}

async function fetchFeed(): Promise<Post[]> {
  const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/feed`, {
    method: 'GET',
    cache: 'no-cache'
  });

  if (!result.ok) {
    return [];
  }

  const feedData: FeedPost[] = await result.json();

  return feedData.map((post) => ({
    id: post.id,
    user_id: post.author.id,
    user_name: post.author.name || '',
    user_email: '',
    user_avatar: post.author.avatar || '',
    content: post.content,
    like: post.likeCount,
    star: post.bookmarkCount,
    reply_count: post.repliesCount,
    share: post.shareCount,
  }));
}

export default async function Page() {
  const posts = await fetchFeed();

  return (
    <div className="px-4 pt-4">
      <PostStore data={posts} />
    </div>
  );
}
