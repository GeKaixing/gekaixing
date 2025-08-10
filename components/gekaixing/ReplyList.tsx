"use client"

import { replyStore } from "@/store/reply"
import ReplyCard from "./ReplyCard"

export default function ReplyList() {

    const data = replyStore(state => state.replys)

    return (
        <div className="flex flex-col gap-6">
            {data.map((items: {
                id: string,
                user_id: string,
                user_name: string,
                user_email: string,
                user_avatar: string,
                content: string
                like: number,
                star: number,
                reply_count: number,
                share: number,
                post_id: string
                reply_id: string | null
            }) =>
                <ReplyCard
                    reply_id={items.reply_id}
                    key={items.id}
                    post_id={items.post_id}
                    id={items.id}
                    user_id={items.user_id}
                    user_name={items.user_name}
                    user_email={items.user_email}
                    user_avatar={items.user_avatar}
                    content={items.content}
                    like={items.like}
                    star={items.star}
                    reply_count={items.reply_count}
                    share={items.share}
                />

            )}

        </div>
    )
}
