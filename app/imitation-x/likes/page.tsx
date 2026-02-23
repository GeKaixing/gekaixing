import ArrowLeftBack from '@/components/gekaixing/ArrowLeftBack'
import PostStore from '@/components/gekaixing/PostStore'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { getTranslations } from 'next-intl/server'
import { Search } from 'lucide-react'

import type { Post } from '../page'
import { Prisma } from '@/generated/prisma/client'

export const dynamic = 'force-dynamic'

type FeedPage = {
  data: Post[]
  page: {
    nextCursor: string | null
    hasMore: boolean
  }
}

async function getLikedFeed(userId: string, search: string, limit: number = 20): Promise<FeedPage> {
  const where: Prisma.PostWhereInput = {
    parentId: null,
    likes: {
      some: {
        userId,
      },
    },
    ...(search
      ? {
          content: {
            contains: search,
            mode: 'insensitive',
          },
        }
      : {}),
  }

  const rows = await prisma.post.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
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
      likes: {
        where: { userId },
        select: { id: true },
      },
      bookmarks: {
        where: { userId },
        select: { id: true },
      },
      shares: {
        where: { userId },
        select: { id: true },
      },
    },
  })

  const hasMore = rows.length > limit
  const posts = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? posts[posts.length - 1]?.id ?? null : null

  return {
    data: posts.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      user_id: post.author.id,
      user_name: post.author.name,
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
      nextCursor,
      hasMore,
    },
  }
}

export default async function LikesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<JSX.Element> {
  const tSidebar = await getTranslations('ImitationX.Sidebar')
  const tSearch = await getTranslations('ImitationX.SearchPage')
  const tSearchInput = await getTranslations('ImitationX.Search')
  const search = (await searchParams).q?.trim() || ''

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <ArrowLeftBack name={tSidebar('likes')} />
      <div className='px-4 pb-2'>
        <form method='GET' className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <input
            name='q'
            defaultValue={search}
            placeholder={tSearchInput('placeholder')}
            className='h-9 w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary'
          />
        </form>
      </div>
      {!user?.id ? (
        <div className='px-4 pb-4 text-sm text-muted-foreground'>{tSearch('empty')}</div>
      ) : (
        <div className='px-4 pt-4'>
          <LikesContent userId={user.id} search={search} />
        </div>
      )}
    </div>
  )
}

async function LikesContent({ userId, search }: { userId: string; search: string }): Promise<JSX.Element> {
  const feed = await getLikedFeed(userId, search)

  return (
    <PostStore
      data={feed.data}
      nextCursor={feed.page.nextCursor}
      hasMore={feed.page.hasMore}
      feedQuery={{ scope: 'user-liked', targetId: userId }}
    />
  )
}
