import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get('postId')
    const userId = req.nextUrl.searchParams.get('userId') // 前端传

    if (!postId) {
      return NextResponse.json(
        { success: false, message: 'Missing postId' },
        { status: 400 }
      )
    }

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
            select: { id: true },
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
            select: { id: true },
          })
        : null,
    ])

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        likeCount: post.likeCount,
        shareCount: post.shareCount,
        bookmarkCount: post.starCount,
        isLiked: !!like,
        isBookmarked: !!bookmark,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
