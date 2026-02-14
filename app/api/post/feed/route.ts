import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  try {
    // ✅ 1. 创建 Supabase Server Client
    const supabase = await createClient();

    // ✅ 2. 获取当前用户
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id;

    // ✅ 3. 高性能查询
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,

      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },

        // ✅ 统计数量（数据库 count）
        _count: {
          select: {
            likes: true,
            bookmarks: true,
            shares: true,
            replies: true,
          },
        },

        // ✅ 只查当前用户是否点赞
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
    });

    // ✅ 4. 格式化输出
    const result = posts.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,

      author: post.author,

      likeCount: post._count.likes,
      bookmarkCount: post._count.bookmarks,
      shareCount: post._count.shares,
      repliesCount: post._count.replies,

      likedByMe: post.likes?.length > 0,
      bookmarkedByMe: post.bookmarks?.length > 0,
      sharedByMe: post.shares?.length > 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Feed load failed" }, { status: 500 });
  }
}
