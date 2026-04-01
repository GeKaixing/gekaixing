import { prisma } from "@/lib/prisma";
import { UserActionType } from "@/generated/prisma/enums";
import { logUserAction } from "@/lib/feed/actions";
import { invalidateAuthorAudienceFeed, invalidateUserHomeFeed } from "@/lib/feed/service";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { extractYouTubeEmbedUrl } from "@/utils/function/extractYouTubeEmbedUrl";
import { createClient } from "@/utils/supabase/server";

function transformPost(post: any) {
  return {
    id: post.id,
    user_id: post.authorId,
    user_name: post.author?.name || "",
    user_email: post.author?.email || "",
    user_avatar: post.author?.avatar || "",
    user_userid: post.author?.userid || "",
    content: post.content,
    videoUrl: post.videoUrl ?? null,
    like: post.likeCount || 0,
    star: 0,
    reply_count: post.replyCount || post._count?.replies || 0,
    share: post.shareCount || 0,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  try {
    if (id && type === "user_id") {
      const posts = await prisma.post.findMany({
        where: {
          authorId: id,
          parentId: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
        include: {
          author: true,
          _count: {
            select: { likes: true, bookmarks: true, shares: true, replies: true },
          },
        },
      });

      const transformedPosts = posts.map((post) => ({
        id: post.id,
        user_id: post.authorId,
        user_name: post.author?.name || "",
        user_email: post.author?.email || "",
        user_avatar: post.author?.avatar || "",
        user_userid: post.author?.userid || "",
        content: post.content,
        videoUrl: post.videoUrl ?? null,
        like: post._count?.likes || 0,
        star: post._count?.bookmarks || 0,
        reply_count: post._count?.replies || 0,
        share: post._count?.shares || 0,
      }));
      return NextResponse.json({ data: transformedPosts, success: true });
    }

    if (id) {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
          _count: {
            select: { likes: true, bookmarks: true, shares: true, replies: true },
          },
          replies: {
            orderBy: { createdAt: "asc" },
            include: { 
              author: true,
              _count: {
                select: { likes: true, bookmarks: true, shares: true, replies: true },
              },
            },
          },
        },
      });

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      return NextResponse.json({
        data: {
          id: post.id,
          user_id: post.authorId,
          user_name: post.author?.name || "",
          user_email: post.author?.email || "",
          user_avatar: post.author?.avatar || "",
          user_userid: post.author?.userid || "",
          content: post.content,
          videoUrl: post.videoUrl ?? null,
          like: post._count?.likes || 0,
          star: post._count?.bookmarks || 0,
          reply_count: post._count?.replies || 0,
          share: post._count?.shares || 0,
          replies: post.replies?.map((reply: any) => ({
            id: reply.id,
            user_id: reply.authorId,
            user_name: reply.author?.name || "",
            user_email: reply.author?.email || "",
            user_avatar: reply.author?.avatar || "",
            user_userid: reply.author?.userid || "",
            content: reply.content,
            videoUrl: reply.videoUrl ?? null,
            like: reply._count?.likes || 0,
            star: reply._count?.bookmarks || 0,
            reply_count: reply._count?.replies || 0,
            share: reply._count?.shares || 0,
          })),
        },
        success: true,
      });
    }

    const posts = await prisma.post.findMany({
      where: {
        parentId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      include: {
        author: true,
        _count: {
          select: { likes: true, bookmarks: true, shares: true, replies: true },
        },
      },
    });

    const transformedPosts = posts.map((post) => ({
      id: post.id,
      user_id: post.authorId,
      user_name: post.author?.name || "",
      user_email: post.author?.email || "",
      user_avatar: post.author?.avatar || "",
      user_userid: post.author?.userid || "",
      content: post.content,
      videoUrl: post.videoUrl ?? null,
      like: post._count?.likes || 0,
      star: post._count?.bookmarks || 0,
      reply_count: post._count?.replies || 0,
      share: post._count?.shares || 0,
    }));
    return NextResponse.json({ data: transformedPosts, success: true });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, parentId, rootId, videoUrl: inputVideoUrl } = await request.json();
    const containsEmbeddedYouTube = typeof content === "string" && content.includes("data-youtube-embed");
    const videoUrl = containsEmbeddedYouTube ? null : inputVideoUrl ?? extractYouTubeEmbedUrl(content);

    const post = await prisma.post.create({
      data: {
        content,
        videoUrl,
        authorId: user.id,
        parentId: parentId ?? null,
        rootId: rootId ?? null,
      },
      include: {
        author: true,
      },
    });

    revalidatePath("/gekaixing");
    if (!parentId) {
      await invalidateAuthorAudienceFeed(user.id);
      await logUserAction({
        userId: user.id,
        actionType: UserActionType.POST_CREATE,
        targetPostId: post.id,
        targetAuthorId: user.id,
      });
    } else {
      await invalidateUserHomeFeed(user.id);
      await logUserAction({
        userId: user.id,
        actionType: UserActionType.REPLY_CREATE,
        targetPostId: post.id,
        targetAuthorId: user.id,
      });
    }

    return NextResponse.json({ data: [transformPost(post)], success: true });
  } catch (error: any) {
    console.error("POST /api/post failed:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const deleted = await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/gekaixing");
    await invalidateUserHomeFeed(deleted.authorId);

    return NextResponse.json({ data: deleted, success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
