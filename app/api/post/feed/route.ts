export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const cookie=await cookies()
    let userId: string | undefined;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id;
    } catch {
      userId = undefined;
    }

    const posts = await prisma.post.findMany({
      where: {
        parentId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,

      include: {
        author: {
          select: {
            id: true,
            userid: true,
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

    // 格式化输出
    const result = posts.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,

      user_id: post.author.id,
      user_name: post.author.name,
      user_avatar: post.author.avatar,
      user_userid: post.author.userid,

      like: post._count.likes,
      star: post._count.bookmarks,
      share: post._count.shares,
      reply: post._count.replies,

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
