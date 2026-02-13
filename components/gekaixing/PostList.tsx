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
                        key={items.id}
                        id={items.id}
                        user_id={items.user_id}
                        user_name={items.user_name}
                        user_email={items.user_email}
                        user_avatar={items.user_avatar}
                        content={items.content}
                        like={items.like}
                        star={items.star}
                        reply={items.reply_count}
                        share={items.share}
                    />
                ))
            }
        </div>
    )
}
