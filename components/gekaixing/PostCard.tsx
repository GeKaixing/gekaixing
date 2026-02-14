"use client"

import React, { useEffect, useState } from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Heart, MessageCircleMore, Share2, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PostDropdownMenu from './PostDropdownMenu'
import Link from 'next/link'
import { copyToClipboard } from '@/utils/function/copyToClipboard'
import { postStore } from '@/store/post'
import { userStore } from '@/store/user'

async function toggleLike(postId: string, isLiked: boolean): Promise<{ success: boolean; likeCount?: number }> {
    try {
        const url = `/api/like?postId=${postId}`
        const response = await fetch(url, {
            method: isLiked ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: isLiked ? undefined : JSON.stringify({ postId }),
        })
        const data = await response.json()
        if (data.success) {
            return { success: true, likeCount: data.data.likeCount }
        }
        return { success: false }
    } catch {
        return { success: false }
    }
}

async function toggleBookmark(postId: string, isBookmarked: boolean): Promise<boolean> {
    try {
        const url = `/api/bookmark?postId=${postId}`
        const response = await fetch(url, {
            method: isBookmarked ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: isBookmarked ? undefined : JSON.stringify({ postId }),
        })
        const data = await response.json()
        return data.success
    } catch {
        return false
    }
}

async function recordShare(postId: string): Promise<{ success: boolean; shareCount?: number }> {
    try {
        const response = await fetch('/api/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId }),
        })
        const data = await response.json()
        if (data.success) {
            return { success: true, shareCount: data.data.shareCount }
        }
        return { success: false }
    } catch {
        return { success: false }
    }
}

async function fetchInteractionStatus(postId: string): Promise<{ isLiked: boolean; isBookmarked: boolean; likeCount: number; shareCount: number }> {
    try {
        const [likeRes, bookmarkRes, shareRes] = await Promise.all([
            fetch(`/api/like?postId=${postId}`),
            fetch(`/api/bookmark?postId=${postId}`),
            fetch(`/api/share?postId=${postId}`),
        ])

        const [likeData, bookmarkData, shareData] = await Promise.all([
            likeRes.json(),
            bookmarkRes.json(),
            shareRes.json(),
        ])

        return {
            isLiked: likeData.data?.isLiked || false,
            isBookmarked: bookmarkData.data?.isBookmarked || false,
            likeCount: likeData.data?.likeCount || 0,
            shareCount: shareData.data?.shareCount || 0,
        }
    } catch {
        return { isLiked: false, isBookmarked: false, likeCount: 0, shareCount: 0 }
    }
}

export default function PostCard({
    id,
    user_id,
    user_name,
    user_email,
    user_avatar,
    content,
    like: initialLike,
    star: initialStar,
    reply: initialReply,
    share: initialShare,
    isLiked: initialIsLiked = false,
    isBookmarked: initialIsBookmarked = false,
}: {
    id: string
    user_id: string
    user_name: string
    user_email: string
    user_avatar: string
    content: string
    like: number
    star: number
    reply: number
    share: number
    isLiked?: boolean
    isBookmarked?: boolean
}) {
    const post = postStore(state => state.posts.find(p => p.id === id))
    const updatePost = postStore(state => state.updatePost)

    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const currentUser = userStore.getState()
        if (currentUser.id) {
            fetchInteractionStatus(id).then(status => {
                setIsLiked(status.isLiked)
                setIsBookmarked(status.isBookmarked)
                updatePost(id, {
                    like: status.likeCount,
                    share: status.shareCount,
                })
            })
        }
    }, [id, updatePost])

    if (!post) return null

    const { like, star, share, reply_count } = post

    const handleLike = async () => {
        if (isLoading) return
        setIsLoading(true)

        const previousLike = like
        const previousIsLiked = isLiked
        const newLikeCount = isLiked ? like - 1 : like + 1

        updatePost(id, { like: newLikeCount })
        setIsLiked(!isLiked)

        const result = await toggleLike(id, previousIsLiked)

        if (!result.success) {
            updatePost(id, { like: previousLike })
            setIsLiked(previousIsLiked)
        } else if (result.likeCount !== undefined) {
            updatePost(id, { like: result.likeCount })
        }

        setIsLoading(false)
    }

    const handleBookmark = async () => {
        if (isLoading) return
        setIsLoading(true)

        const previousStar = star
        const previousIsBookmarked = isBookmarked
        const newStarCount = isBookmarked ? star - 1 : star + 1

        updatePost(id, { star: newStarCount })
        setIsBookmarked(!isBookmarked)

        const success = await toggleBookmark(id, previousIsBookmarked)

        if (!success) {
            updatePost(id, { star: previousStar })
            setIsBookmarked(previousIsBookmarked)
        }

        setIsLoading(false)
    }

    const handleShare = async () => {
        if (isLoading) return
        setIsLoading(true)

        const previousShare = share
        const newShareCount = share + 1

        updatePost(id, { share: newShareCount })

        const result = await recordShare(id)

        if (!result.success) {
            updatePost(id, { share: previousShare })
        } else if (result.shareCount !== undefined) {
            updatePost(id, { share: result.shareCount })
        } else {
            updatePost(id, { share: newShareCount })
        }

        copyToClipboard(`https://www.gekaixing.top/imitation-x/status/${id}`)
        setIsLoading(false)
    }

    return (
        <Card className="cursor-pointer hover:bg-gray-50">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle className="hover:bg-gray-100">
                        <Avatar>
                            <AvatarImage src={user_avatar} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </CardTitle>
                    <CardDescription className="hover:bg-gray-100">{user_name}</CardDescription>
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
            {userStore.getState().id && (
                <CardFooter>
                    <ul className="flex justify-between items-center w-full">
                        <li
                            className={`flex gap-2 hover:text-blue-400 ${isLiked ? 'text-blue-400' : ''}`}
                            onClick={handleLike}
                        >
                            <div className={`w-7 h-7 flex justify-center items-center rounded-full hover:bg-blue-400/10 ${isLoading ? 'opacity-50' : ''}`}>
                                <Heart className={isLiked ? 'fill-current' : ''} />
                            </div>
                            {like || 0}
                        </li>
                        <Link href={`/imitation-x/status/${id}`} className="flex gap-2 hover:text-green-400">
                            <div className="w-7 h-7 flex justify-center items-center rounded-full hover:bg-green-400/10">
                                <MessageCircleMore />
                            </div>
                            {reply_count || 0}
                        </Link>
                        <li
                            className={`flex gap-2 hover:text-red-400 ${isBookmarked ? 'text-red-400' : ''}`}
                            onClick={handleBookmark}
                        >
                            <div className={`w-7 h-7 flex justify-center items-center rounded-full hover:bg-red-400/10 ${isLoading ? 'opacity-50' : ''}`}>
                                <Star className={isBookmarked ? 'fill-current' : ''} />
                            </div>
                            {star || 0}
                        </li>
                        <li className="flex gap-2 hover:text-blue-400" onClick={handleShare}>
                            <div className={`w-7 h-7 flex justify-center items-center rounded-full hover:bg-blue-400/10 ${isLoading ? 'opacity-50' : ''}`}>
                                <Share2 />
                            </div>
                            {share || 0}
                        </li>
                    </ul>
                </CardFooter>
            )}
        </Card>
    )
}
