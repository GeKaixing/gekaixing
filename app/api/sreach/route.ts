import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  if (!query.trim()) {
    return NextResponse.json({ data: [], success: true, message: "Empty query" });
  }

  const posts = await prisma.post.findMany({
    where: {
      parentId: null,
      OR: [
        { content: { contains: query } },
        { author: { name: { contains: query } } },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          userid: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      _count: {
        select: { likes: true, bookmarks: true, shares: true, replies: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const transformedPosts = posts.map((post) => ({
    id: post.id,
    user_id: post.authorId,
    user_name: post.author?.name || "",
    user_email: post.author?.email || "",
    user_avatar: post.author?.avatar || "",
    user_userid: post.author?.userid || "",
    content: post.content,
    like: post._count?.likes || 0,
    star: post._count?.bookmarks || 0,
    reply_count: post._count?.replies || 0,
    share: post._count?.shares || 0,
  }));

  return NextResponse.json({ data: transformedPosts, success: true });
}
