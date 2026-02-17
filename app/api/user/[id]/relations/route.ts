import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);

  const type = url.searchParams.get("type");

  try {
    let users: {
      name: string | null;
      id: string;
      userid: string;
      email: string;
      avatar: string | null;
      backgroundImage: string | null;
      briefIntroduction: string | null;
      createdAt: Date;
      updatedAt: Date;
    }[] = [];

    // ===== 推荐关注 =====
    if (type === "recommended") {
      const followingIds = await prisma.follow.findMany({
        where: { followerId: user.id },
        select: { followingId: true },
      });

      const ids = followingIds.map((f) => f.followingId);

      users = await prisma.user.findMany({
        where: {
          id: {
            notIn: [...ids, user.id],
          },
        },
        take: 20,
      });
    }

    // ===== 粉丝 =====
    if (type === "followers") {
      const followers = await prisma.follow.findMany({
        where: { followingId: params.id },
        include: { follower: true },
      });

      users = followers.map((f) => f.follower);
    }

    // ===== 关注中 =====
    if (type === "following") {
      const following = await prisma.follow.findMany({
        where: { followerId: params.id },
        include: { following: true },
      });

      users = following.map((f) => f.following);
    }

    // 当前用户已关注列表（用于 isFollowing）
    const myFollowing = await prisma.follow.findMany({
      where: { followerId: user.id },
      select: { followingId: true },
    });

    const myFollowingIds = new Set(myFollowing.map((f) => f.followingId));

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        id: u.id,
        name: u.name || "用户",
        handle: u.userid,
        avatar: u.avatar,
        bio: u.briefIntroduction,
        isFollowing: myFollowingIds.has(u.id),
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}
