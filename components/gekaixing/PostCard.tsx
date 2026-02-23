"use client"

import React, { useState } from "react"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Heart, MessageCircleMore, Share2, ShieldCheck, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PostDropdownMenu from "./PostDropdownMenu"
import Link from "next/link"
import { Post } from "@/app/imitation-x/page"
import { postStore } from "@/store/post"
import { replyStore } from "@/store/reply"

export default function PostCard({
    id,
    user_id,
    user_name,
    user_avatar,
    user_userid,
    content,
    like,
    star,
    reply,
    share,
    likedByMe,
    bookmarkedByMe,
    isPremium
}: Post) {
    const [liked, setLiked] = useState(likedByMe)
    const [bookmarked, setBookmarked] = useState(bookmarkedByMe)
    const [likeCount, setLikeCount] = useState(like)
    const [starCount, setStarCount] = useState(star)
    const [shareCount, setShareCount] = useState(share)

    const [likeLoading, setLikeLoading] = useState(false)
    const [bookmarkLoading, setBookmarkLoading] = useState(false)
    const [shareLoading, setShareLoading] = useState(false)

    React.useEffect(() => {
        setLiked(likedByMe)
        setBookmarked(bookmarkedByMe)
        setLikeCount(like)
        setStarCount(star)
        setShareCount(share)
    }, [bookmarkedByMe, like, likedByMe, share, star])

    const syncInteractionToStore = (patch: Partial<Post>): void => {
        const postState = postStore.getState()
        const replyState = replyStore.getState()

        if (postState.posts.some((postItem) => postItem.id === id)) {
            postState.updatePost(id, patch)
        }

        if (replyState.replies.some((replyItem) => replyItem.id === id)) {
            replyState.updateReply(id, patch)
        }
    }

    // =========================
    // ❤️ 点赞
    // =========================
    const handleLike = async () => {
        if (likeLoading) return
        setLikeLoading(true)

        const prevLiked = liked
        const prevCount = likeCount

        // 乐观更新
        setLiked(!prevLiked)
        setLikeCount(prevLiked ? likeCount - 1 : likeCount + 1)
        syncInteractionToStore({
            likedByMe: !prevLiked,
            like: prevLiked ? likeCount - 1 : likeCount + 1,
        })

        const res = await fetch(`/api/like?postId=${id}`, {
            method: prevLiked ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body: prevLiked ? undefined : JSON.stringify({ postId: id }),
        })

        const data = await res.json()

        if (!data.success) {
            // 回滚
            setLiked(prevLiked)
            setLikeCount(prevCount)
            syncInteractionToStore({
                likedByMe: prevLiked,
                like: prevCount,
            })
        } else {
            setLikeCount(data.data.likeCount)
            syncInteractionToStore({
                likedByMe: !prevLiked,
                like: data.data.likeCount,
            })
        }

        setLikeLoading(false)
    }

    // =========================
    // ⭐ 收藏
    // =========================
    const handleBookmark = async () => {
        if (bookmarkLoading) return
        setBookmarkLoading(true)

        const prevBookmarked = bookmarked
        const prevStar = starCount

        setBookmarked(!prevBookmarked)
        setStarCount(prevBookmarked ? starCount - 1 : starCount + 1)
        syncInteractionToStore({
            bookmarkedByMe: !prevBookmarked,
            star: prevBookmarked ? starCount - 1 : starCount + 1,
        })

        const res = await fetch(`/api/bookmark?postId=${id}`, {
            method: prevBookmarked ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body: prevBookmarked ? undefined : JSON.stringify({ postId: id }),
        })

        const data = await res.json()

        if (!data.success) {
            setBookmarked(prevBookmarked)
            setStarCount(prevStar)
            syncInteractionToStore({
                bookmarkedByMe: prevBookmarked,
                star: prevStar,
            })
        }

        setBookmarkLoading(false)
    }

    // =========================
    // 🔄 分享
    // =========================
    const handleShare = async () => {
        if (shareLoading) return
        setShareLoading(true)

        const prevShare = shareCount
        setShareCount(prevShare + 1)
        syncInteractionToStore({
            share: prevShare + 1,
        })

        const res = await fetch("/api/share", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: id }),
        })

        const data = await res.json()

        if (!data.success) {
            setShareCount(prevShare)
            syncInteractionToStore({
                share: prevShare,
            })
        } else {
            setShareCount(data.data.shareCount)
            syncInteractionToStore({
                sharedByMe: true,
                share: data.data.shareCount,
            })
        }

        await navigator.clipboard.writeText(
            `${window.location.origin}/imitation-x/status/${id}`
        )

        setShareLoading(false)
    }

    return (
        <Card className="cursor-pointer hover:bg-muted/60 transition-colors">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <CardTitle>
                        <Avatar>
                            <AvatarImage src={user_avatar || ''} />
                            <AvatarFallback>
                                {user_name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </CardTitle>

                    <div className="flex flex-col">
                        <CardDescription className="font-semibold text-foreground flex items-center">
                            {user_name}
                            {isPremium && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                        </CardDescription>
                        <span className="text-sm text-muted-foreground">
                            @{user_userid}
                        </span>
                    </div>
                </div>

                <CardAction>
                    <PostDropdownMenu id={id} user_id={user_id} content={content} />
                </CardAction>
            </CardHeader>

            <CardContent>
                <Link href={`/imitation-x/status/${id}`}>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </Link>
            </CardContent>

            <CardFooter>
                <ul className="flex justify-between items-center w-full">
                    {/* ❤️ 点赞 */}
                    <li
                        onClick={handleLike}
                        className={`flex gap-2 items-center cursor-pointer hover:text-red-500 ${liked ? "text-red-500" : ""
                            } ${likeLoading ? "opacity-50" : ""}`}
                    >
                        <Heart className={liked ? "fill-current" : ""} />
                        {likeCount}
                    </li>

                    {/* 💬 回复 */}
                    <Link
                        href={`/imitation-x/status/${id}`}
                        className="flex gap-2 items-center hover:text-green-500"
                    >
                        <MessageCircleMore />
                        {reply}
                    </Link>

                    {/* ⭐ 收藏 */}
                    <li
                        onClick={handleBookmark}
                        className={`flex gap-2 items-center cursor-pointer hover:text-yellow-500 ${bookmarked ? "text-yellow-500" : ""
                            } ${bookmarkLoading ? "opacity-50" : ""}`}
                    >
                        <Star className={bookmarked ? "fill-current" : ""} />
                        {starCount}
                    </li>

                    {/* 🔄 分享 */}
                    <li
                        onClick={handleShare}
                        className={`flex gap-2 items-center cursor-pointer hover:text-blue-500 ${shareLoading ? "opacity-50" : ""
                            }`}
                    >
                        <Share2 />
                        {shareCount}
                    </li>
                </ul>
            </CardFooter>
        </Card>
    )
}
