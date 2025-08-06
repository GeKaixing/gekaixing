import PostCard from '@/components/towel/PostCard'
import SearchInput from '@/components/towel/SearchInput'
import React from 'react'

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { query = '' } = await searchParams
    const reslut = await fetch(`${'http://localhost:3000'}/api/sreach?query=${query}`)
    const data = await reslut.json()

    return (
        <div>
            <SearchInput></SearchInput>
            <div className='w-full mt-2'></div>
            {data.data.lenght === 0 ? <></> :
                data.data.map((items: {
                    id: string,
                    user_id: string,
                    user_name: string,
                    user_email: string,
                    user_avatar: string,
                    content: string
                    like: number,
                    star: number,
                    reply_count: number,
                    share: number
                }) => {
                    return <PostCard
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
                    ></PostCard>
                })
            }
        </div>
    )
}
