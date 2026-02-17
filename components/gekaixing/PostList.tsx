"use client"
import { postStore } from "@/store/post"
import PostCard from "./PostCard"

export default function PostList() {
    const posts = postStore(state => state.posts)
    return (
        <div className="flex flex-col gap-6">
            {
                posts.map((items) => (
                    <PostCard
                        isPremium={items.isPremium}
                        key={items.id}
                        id={items.id}
                        createdAt={items.createdAt}
                        user_id={items.user_id}
                        user_name={items.user_name || ''}
                        user_avatar={items.user_avatar || ''}
                        user_userid={items.user_userid}
                        content={items.content}
                        like={items.like}
                        star={items.star}
                        reply={items.reply}
                        share={items.share}
                        likedByMe={!!items.likedByMe}
                        bookmarkedByMe={!!items.bookmarkedByMe}
                        sharedByMe={!!items.sharedByMe}
                    />
                ))
            }
        </div>
    )
}
