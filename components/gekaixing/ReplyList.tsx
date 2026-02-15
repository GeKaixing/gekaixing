"use client"

import { replyStore } from "@/store/reply"
import ReplyCard from "./ReplyCard"
import { Reply } from "./ReplyStore"

export default function ReplyList() {

    const data = replyStore(state => state.replys)

    return (
        <div className="flex flex-col gap-6">
            {data.map((items: Reply) =>
                <ReplyCard
                    reply_id={items.id}
                    key={items.id}
                    post_id={items.parentId || ''}
                    id={items.id}
                    user_id={items.author?.id || items.authorId}
                    user_name={items.author?.name || '未知用户'}
                    user_email={items.author?.email || ''}
                    user_avatar={items.author?.avatar || ''}
                    content={items.content}
                    like={items.likeCount}
                    star={items.shareCount}
                    reply_count={items.replyCount}
                    share={items.shareCount}
                />

            )}

        </div>
    )
}
