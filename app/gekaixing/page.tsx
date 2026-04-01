import PostStore from "@/components/gekaixing/PostStore";
import { getHomeFeed } from "@/lib/feed/service";
import type { FeedPage, FeedPostItem as Post } from "@/lib/feed/types";
import { prisma } from "@/lib/prisma";
import { withTimeoutOrNull } from "@/lib/with-timeout";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export type { Post };
export type { FeedPage };

const EMPTY_FEED: FeedPage = {
  data: [],
  page: {
    nextCursor: null,
    hasMore: false,
  },
};

async function getFeed(limit: number = 20): Promise<FeedPage> {
  let userId: string | null = null;

  try {
    const supabase = await createClient();
    const authResult = await withTimeoutOrNull(supabase.auth.getUser(), 8000);
    const user = authResult?.data.user ?? null;
    userId = user?.id ?? null;

    const feed = await withTimeoutOrNull(
      getHomeFeed({
        userId,
        cursor: null,
        limit,
      }),
      8000
    );

    if (feed) {
      return feed;
    }

    return getFallbackFeed(userId, limit);
  } catch (error) {
    console.error("Failed to load gekaixing feed:", error);
    return getFallbackFeed(userId, limit);
  }
}

async function getFallbackFeed(userId: string | null, limit: number): Promise<FeedPage> {
  try {
    const rows = await withTimeoutOrNull(
      prisma.post.findMany({
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          id: true,
          content: true,
          createdAt: true,
          videoUrl: true,
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
          likes: userId
            ? {
                where: { userId },
                select: { id: true },
              }
            : false,
          bookmarks: userId
            ? {
                where: { userId },
                select: { id: true },
              }
            : false,
          shares: userId
            ? {
                where: { userId },
                select: { id: true },
              }
            : false,
        },
      }),
      8000
    );

    if (!rows) {
      return EMPTY_FEED;
    }

    return {
      data: rows.map((post) => ({
        id: post.id,
        content: post.content,
        videoUrl: post.videoUrl ?? null,
        audioUrl: null,
        createdAt: post.createdAt,
        user_id: post.author.id,
        user_name: post.author.name,
        user_email: null,
        user_avatar: post.author.avatar,
        user_userid: post.author.userid,
        isPremium: post.author.isPremium,
        like: post._count.likes,
        star: post._count.bookmarks,
        share: post._count.shares,
        reply: post._count.replies,
        likedByMe: post.likes?.length > 0,
        bookmarkedByMe: post.bookmarks?.length > 0,
        sharedByMe: post.shares?.length > 0,
      })),
      page: {
        nextCursor: null,
        hasMore: false,
      },
    };
  } catch (fallbackError) {
    console.error("Failed to load fallback feed:", fallbackError);
    return EMPTY_FEED;
  }
}

export default async function Page() {
  const feed = await getFeed();

  return (
    <div className="px-4 pt-4">
      <PostStore data={feed.data} nextCursor={feed.page.nextCursor} hasMore={feed.page.hasMore} />
    </div>
  );
}
