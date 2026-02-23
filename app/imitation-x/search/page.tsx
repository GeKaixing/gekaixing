import Link from 'next/link'
import React from 'react'
import { getTranslations } from 'next-intl/server'

import PostCard from '@/components/gekaixing/PostCard'
import SearchInput from '@/components/gekaixing/SearchInput'

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const t = await getTranslations("ImitationX.SearchPage")
    const { query = '' } = await searchParams
    const reslut = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sreach?query=${query}`)
    const data = await reslut.json()

    return (
        <div>
            <SearchInput></SearchInput>
            <div className='w-full mt-2'></div>
            {data?.data?.length === 0 ? <div className='flex flex-col gap-2 items-center'>
                <span>{t("empty")}</span>
                <Link href={'/imitation-x/post'} className='text-blue-400'>{t("publish")}</Link>
            </div> :
                <div className='flex flex-col gap-6'>
                    {data.data.map((items: {
                        id: string,
                        user_id: string,
                        user_name: string,
                        user_email: string,
                        user_avatar: string,
                        user_userid: string,
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
                            user_avatar={items.user_avatar}
                            user_userid={items.user_userid}
                            content={items.content}
                            createdAt={new Date()}
                            like={items.like}
                            star={items.star}
                            reply={items.reply_count}
                            share={items.share}
                            likedByMe={false}
                            bookmarkedByMe={false}
                            sharedByMe={false}
                            isPremium={false}
                        ></PostCard>
                    })}
                </div>
            }
        </div>
    )
}
