"use client"

import { Post } from "@/app/imitation-x/page"
import { replyStore } from "@/store/reply"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import PostCard from "./PostCard"

type ReplyListProps = {
  initialNextCursor?: string | null
  initialHasMore?: boolean
  feedQuery?: Record<string, string>
}

type FeedApiPost = Omit<Post, "createdAt"> & {
  createdAt: string
}

type FeedApiResponse = {
  data: FeedApiPost[]
  page: {
    nextCursor: string | null
    hasMore: boolean
  }
}

const PAGE_SIZE = 20
const DEFAULT_ROW_HEIGHT = 280
const OVERSCAN_PX = 900
const LOAD_MORE_THRESHOLD_PX = 1200

function findItemIndexByOffset(offsets: number[], target: number): number {
  if (offsets.length <= 1) {
    return 0
  }

  let low = 0
  let high = offsets.length - 1

  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2)
    if (offsets[mid] <= target) {
      low = mid
    } else {
      high = mid - 1
    }
  }

  return Math.max(0, Math.min(low, offsets.length - 2))
}

export default function ReplyList({ initialNextCursor = null, initialHasMore = false, feedQuery }: ReplyListProps) {
  const t = useTranslations("ImitationX.Feed")
  const replies = replyStore((state) => state.replies)

  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor)
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [viewport, setViewport] = useState<{ top: number; height: number }>({ top: 0, height: 0 })
  const [measureVersion, setMeasureVersion] = useState<number>(0)

  const listRef = useRef<HTMLDivElement | null>(null)
  const rowHeightsRef = useRef<Map<string, number>>(new Map())
  const observerMapRef = useRef<Map<string, ResizeObserver>>(new Map())
  const feedQueryString = useMemo<string>(() => {
    if (!feedQuery) {
      return "{}"
    }
    return JSON.stringify(feedQuery)
  }, [feedQuery])

  useEffect(() => {
    setNextCursor(initialNextCursor)
    setHasMore(initialHasMore)
  }, [initialHasMore, initialNextCursor])

  const offsets = useMemo(() => {
    const nextOffsets: number[] = [0]

    for (const reply of replies) {
      const height = rowHeightsRef.current.get(reply.id) ?? DEFAULT_ROW_HEIGHT
      nextOffsets.push(nextOffsets[nextOffsets.length - 1] + height)
    }

    return nextOffsets
  }, [measureVersion, replies])

  const totalHeight = offsets[offsets.length - 1] ?? 0

  const updateViewport = useCallback(() => {
    if (!listRef.current) {
      return
    }

    const rect = listRef.current.getBoundingClientRect()
    const start = Math.max(0, -rect.top)
    const end = Math.min(rect.height, window.innerHeight - rect.top)
    const height = Math.max(0, end - start)

    setViewport({ top: start, height })
  }, [])

  useEffect(() => {
    updateViewport()

    const onScroll = (): void => {
      updateViewport()
    }

    const onResize = (): void => {
      updateViewport()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [updateViewport])

  useEffect(() => {
    return () => {
      observerMapRef.current.forEach((observer) => observer.disconnect())
      observerMapRef.current.clear()
    }
  }, [])

  const observeRow = useCallback((postId: string, node: HTMLDivElement | null): void => {
    const observerMap = observerMapRef.current
    const existing = observerMap.get(postId)

    if (!node) {
      if (existing) {
        existing.disconnect()
        observerMap.delete(postId)
      }
      return
    }

    if (existing) {
      existing.disconnect()
      observerMap.delete(postId)
    }

    const observer = new ResizeObserver((entries) => {
      const first = entries[0]
      if (!first) {
        return
      }

      const nextHeight = Math.ceil(first.contentRect.height)
      if (nextHeight <= 0) {
        return
      }

      const currentHeight = rowHeightsRef.current.get(postId)
      if (currentHeight !== nextHeight) {
        rowHeightsRef.current.set(postId, nextHeight)
        setMeasureVersion((value) => value + 1)
      }
    })

    observer.observe(node)
    observerMap.set(postId, observer)
  }, [])

  const loadMore = useCallback(async (): Promise<void> => {
    if (!hasMore || isLoading) {
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE) })
      const parsedFeedQuery = JSON.parse(feedQueryString) as Record<string, string>

      for (const [key, value] of Object.entries(parsedFeedQuery)) {
        if (value) {
          params.set(key, value)
        }
      }

      if (nextCursor) {
        params.set("cursor", nextCursor)
      }

      const response = await fetch(`/api/post/feed?${params.toString()}`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const payload = (await response.json()) as FeedApiResponse
      const normalizedReplies = payload.data.map((reply) => ({
        ...reply,
        createdAt: new Date(reply.createdAt),
      }))

      replyStore.getState().appendReplies(normalizedReplies)
      setNextCursor(payload.page.nextCursor)
      setHasMore(payload.page.hasMore)
    } catch (error) {
      console.error("Failed to load more replies:", error)
      setErrorMessage("加载更多失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }, [feedQueryString, hasMore, isLoading, nextCursor])

  const startOffset = Math.max(0, viewport.top - OVERSCAN_PX)
  const endOffset = Math.min(totalHeight, viewport.top + viewport.height + OVERSCAN_PX)

  const startIndex = replies.length > 0 ? findItemIndexByOffset(offsets, startOffset) : 0
  const endIndex = replies.length > 0 ? findItemIndexByOffset(offsets, endOffset) : -1

  const visibleReplies = endIndex >= startIndex ? replies.slice(startIndex, endIndex + 1) : []
  const topSpacerHeight = offsets[startIndex] ?? 0
  const bottomSpacerHeight = Math.max(0, totalHeight - (offsets[endIndex + 1] ?? 0))

  useEffect(() => {
    if (!hasMore || isLoading || totalHeight === 0) {
      return
    }

    const viewportBottom = viewport.top + viewport.height
    if (totalHeight - viewportBottom <= LOAD_MORE_THRESHOLD_PX) {
      void loadMore()
    }
  }, [hasMore, isLoading, loadMore, totalHeight, viewport.height, viewport.top])

  return (
    <div className="w-full" ref={listRef}>
      <div style={{ height: topSpacerHeight }} aria-hidden />

      {visibleReplies.map((item) => (
        <div
          key={item.id}
          ref={(node) => {
            observeRow(item.id, node)
          }}
          className="pb-6"
        >
          <PostCard
            isPremium={item.isPremium}
            id={item.id}
            createdAt={item.createdAt}
            user_id={item.user_id}
            user_name={item.user_name || ""}
            user_avatar={item.user_avatar || ""}
            user_userid={item.user_userid}
            content={item.content}
            like={item.like}
            star={item.star}
            reply={item.reply}
            share={item.share}
            likedByMe={!!item.likedByMe}
            bookmarkedByMe={!!item.bookmarkedByMe}
            sharedByMe={!!item.sharedByMe}
          />
        </div>
      ))}

      <div style={{ height: bottomSpacerHeight }} aria-hidden />

      {isLoading ? (
        <div className="py-4 text-center text-sm text-muted-foreground">{t("loading")}</div>
      ) : null}

      {!hasMore && replies.length > 0 ? (
        <div className="py-4 text-center text-sm text-muted-foreground">{t("allLoaded")}</div>
      ) : null}

      {errorMessage ? (
        <div className="py-2 text-center text-sm text-red-500">{errorMessage}</div>
      ) : null}
    </div>
  )
}
