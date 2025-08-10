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
    }, [])
    return data.length !== 0 && data.map((item: {
        url: string;
        source_name: string;
        author: string;
        title: string;
    }, index) => (
        <Link
            href={item.url}
            key={index}
            className="flex py-1 flex-col justify-start hover:bg-gray-200 cursor-pointer rounded-2xl p-1"
        >   <span className='text-xl font-semibold'>{item.source_name}</span>
            <span className='text-[16px] text-gray-500'>{item.author}</span>
            <span>{item.title}</span>
        </Link>
    ))

}
