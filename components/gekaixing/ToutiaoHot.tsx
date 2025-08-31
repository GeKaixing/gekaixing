"use server"
import { ChartNoAxesColumn } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
export async function ToutiaoHotGTE() {
    return await fetch('https://dabenshi.cn/other/api/hot.php?type=toutiaoHot', {
        method: 'GET',
    })
}

export default async function ToutiaoHot() {

    const res = await ToutiaoHotGTE()
    const data = await res.json()

    return (
        <div className='border-1 border-gray-200 p-2 rounded-2xl'>
            <span>今日头条</span>
            {data.data.length !== 0 && data.data.slice(1, 6).map((item: { url: string, title: string, hot_value: string }, idx: number) => (
                <Link
                    href={item.url}
                    key={idx}
                    className="flex py-1 flex-col justify-start hover:bg-gray-200 cursor-pointer rounded-2xl p-1"
                >
                    <span>{item.title}</span>
                    <div className='flex '>
                        <ChartNoAxesColumn /> <span>{item.hot_value}</span>
                    </div>
                </Link>
            ))}
            {data.length !== 0 && <span className='text-blue-500'>
                <Link href='/imitation-x/explore' >
                    显示更多
                </Link>
            </span>}
        </div>
    )
}
