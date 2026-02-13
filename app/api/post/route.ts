import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

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
        include: {
          author: true,
          _count: {
            select: { replies: true },
          },
        },
      });

      return NextResponse.json({ data: posts, success: true });
    }

    if (id) {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
          replies: {
            orderBy: { createdAt: "asc" },
            include: { author: true },
          },
        },
      });

      return NextResponse.json({ data: post, success: true });
    }

    const posts = await prisma.post.findMany({
      where: {
        parentId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        _count: {
          select: { replies: true },
        },
      },
    });

    return NextResponse.json({ data: posts, success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { user_id, content, parentId, rootId } = await request.json();

    const post = await prisma.post.create({
      data: {
        content,
        authorId: user_id,
        parentId: parentId ?? null,
        rootId: rootId ?? null,
      },
      include: {
        author: true,
      },
    });

    revalidatePath("/imitation-x");

    return NextResponse.json({ data: [post], success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const deleted = await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/imitation-x");

    return NextResponse.json({ data: deleted, success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
