import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/utils/supabase/server";


// ---------------- POST 创建回复 ----------------
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, post_id, reply_id } = await request.json();

    // rootId 规则：
    // - 回复主帖：rootId = post_id, parentId = post_id
    // - 回复某条回复：rootId = 该回复的 rootId, parentId = reply_id
    let parentId: string;
    let rootId: string;

    if (reply_id) {
      const parent = await prisma.post.findUnique({
        where: { id: reply_id },
        select: { rootId: true },
      });
      if (!parent) {
        return NextResponse.json({ error: "Parent reply not found" }, { status: 404 });
      }
      parentId = reply_id;
      rootId = parent.rootId!;
    } else {
      parentId = post_id;
      rootId = post_id;
    }

    const reply = await prisma.post.create({
      data: {
        content,
        authorId: user.id,
        parentId,
        rootId,
      },
      include: {
        author: true,
      },
    });

    // ✅ replyCount +1
    await prisma.post.update({
      where: { id: parentId },
      data: { replyCount: { increment: 1 } },
    });

    revalidateTag(`reply:post_id:${post_id}`, "page");

    return NextResponse.json({ data: reply, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// ---------------- DELETE 删除回复 ----------------
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    const reply = await prisma.post.findUnique({
      where: { id },
      select: { parentId: true },
    });

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    await prisma.post.delete({ where: { id } });

    // ✅ replyCount -1
    if (reply.parentId) {
      await prisma.post.update({
        where: { id: reply.parentId },
        data: { replyCount: { decrement: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// ---------------- GET 查询回复 ----------------
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (id && type === "post_id") {
      // ✅ 查询某个主帖下的一级回复（parentId = post_id）
      const replies = await prisma.post.findMany({
        where: {
          parentId: id,
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          author: true,
        },
      });

      return NextResponse.json({ data: replies, success: true });
    }

    if (id && type === "reply_id") {
      // ✅ 查询某条回复下的子回复
      const replies = await prisma.post.findMany({
        where: {
          parentId: id,
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          author: true,
        },
      });

      return NextResponse.json({ data: replies, success: true });
    }

    if (id && type === "id") {
      const reply = await prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
        },
      });

      return NextResponse.json({ data: reply, success: true });
    }

    if (id && type === "user_id") {
      const replies = await prisma.post.findMany({
        where: {
          authorId: id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
        },
      });

      return NextResponse.json({ data: replies, success: true });
    }

    // 默认：返回所有回复（一般调试用）
    const replies = await prisma.post.findMany({
      where: {
        parentId: { not: null },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json({ data: replies, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
