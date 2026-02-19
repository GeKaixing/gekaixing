import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import PostStore from "@/components/gekaixing/PostStore";

export const dynamic = "force-dynamic";

export type Post = {
  id: string
  content: string
  createdAt: Date

  user_id: string
  user_name: string | null
  user_email?: string | null
  user_avatar: string | null
  user_userid: string
  isPremium:boolean

  like: number
  star: number
  share: number
  reply: number
  
  likedByMe: boolean
  bookmarkedByMe: boolean
  sharedByMe: boolean
}

async function getFeed(): Promise<Post[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;
  const isLogin = !!userId;

  const posts = await prisma.post.findMany({
    where: { parentId: null },
    orderBy: { createdAt: "desc" },
    take: 20,

    include: {
      author: {
        select: {
          id: true,
          userid: true,
          name: true,
          avatar: true,
          isPremium: true,
        },
      },

      _count: {
        select: {
          likes: true,
          bookmarks: true,
          shares: true,
          replies: true,
        },
      },

      likes: isLogin
        ? { where: { userId }, select: { id: true } }
        : undefined,

      bookmarks: isLogin
        ? { where: { userId }, select: { id: true } }
        : undefined,

      shares: isLogin
        ? { where: { userId }, select: { id: true } }
        : undefined,
    },
  });

  return posts.map((post) => ({
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,

    user_id: post.author.id,
    user_name: post.author.name,
    user_avatar: post.author.avatar,
    user_userid: post.author.userid,
    isPremium: post.author.isPremium,

    like: post._count.likes,
    star: post._count.bookmarks,
    share: post._count.shares,
    reply: post._count.replies,

    likedByMe: !!post.likes?.length,
    bookmarkedByMe: !!post.bookmarks?.length,
    sharedByMe: !!post.shares?.length,
  }));
}


export default async function Page() {
  const posts = await getFeed();
  return (
    <div className="px-4 pt-4">
      <PostStore data={posts} />
    </div>
  );
}
