import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get('postId')
    if (!postId) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    // 获取当前用户（Supabase Auth）
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const userId = user?.id

    // 并行查询
    const [post, like, bookmark] = await Promise.all([
      prisma.post.findUnique({
        where: { id: postId },
        select: {
          likeCount: true,
          shareCount: true,
          starCount: true,
        },
      }),

      userId
        ? prisma.like.findUnique({
            where: {
              userId_postId: {
                userId,
                postId,
              },
            },
          })
        : null,

      userId
        ? prisma.bookmark.findUnique({
            where: {
              userId_postId: {
                userId,
                postId,
              },
            },
          })
        : null,
    ])

    return NextResponse.json({
      success: true,
      data: {
        likeCount: post?.likeCount ?? 0,
        shareCount: post?.shareCount ?? 0,
        bookmarkCount: post?.starCount ?? 0,
        isLiked: !!like,
        isBookmarked: !!bookmark,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
