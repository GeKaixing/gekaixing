"use client"

import { replyStore } from "@/store/reply"
import { Post } from "@/app/imitation-x/page"
import PostCard from "./PostCard"

export default function ReplyList() {

    const data = replyStore(state => state.replies)

    return (
        <div className="flex flex-col gap-6">
            {data.map((items: Post) =>
                <PostCard
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
            )}

        </div>
    )
}
