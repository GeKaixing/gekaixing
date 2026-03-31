import PostStore from "@/components/gekaixing/PostStore";
import { getHomeFeed } from "@/lib/feed/service";
import type { FeedPage, FeedPostItem as Post } from "@/lib/feed/types";
import { prisma } from "@/lib/prisma";
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

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeout);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}

async function getFeed(limit: number = 20): Promise<FeedPage> {
  let userId: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await withTimeout(supabase.auth.getUser(), 5000);
    userId = user?.id ?? null;

    return await withTimeout(
      getHomeFeed({
        userId,
        cursor: null,
        limit,
      }),
      8000,
    );
  } catch (error) {
    console.error("Failed to load imitation-x feed:", error);
    return getFallbackFeed(userId, limit);
  }
}

async function getFallbackFeed(userId: string | null, limit: number): Promise<FeedPage> {
  try {
    const rows = await withTimeout(
      prisma.post.findMany({
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        take: limit,
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
      8000,
    );

    return {
      data: rows.map((post) => ({
        id: post.id,
        content: post.content,
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
