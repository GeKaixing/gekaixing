"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
async function NEWsFetch(url: string) {
    return await fetch(url, {
        next: {
            revalidate: 60, // 以秒为单位，表示 60 秒内使用缓存
        },
        cache: 'force-cache', // 强制使用缓存（默认也可以不写）
    })
}
export default function NEWs({ url }: { url: string }) {
    const [data, setData] = useState([])
    useEffect(() => {
        async function Fetchs() {
            const reslut = await NEWsFetch(url)
            const data = await reslut.json()
            if (data.success) {
                setData(data.data)
            }
        }
        Fetchs()
    }, [url])
    return data.length !== 0 && data.map((item: {
        url: string;
        source_name: string;
        author: string;
        title: string;
    }, index) => (
        <Link
            href={item.url}
            key={index}
            className="flex flex-col justify-start rounded-2xl p-2 py-1 transition-colors hover:bg-muted/60"
        >   <span className='text-xl font-semibold text-foreground'>{item.source_name}</span>
            <span className='text-[16px] text-muted-foreground'>{item.author}</span>
            <span className='text-foreground'>{item.title}</span>
        </Link>
    ))

}
