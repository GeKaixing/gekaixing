"use client"
import { ToutiaoHotGET } from '@/components/towel/Footer'
import { ChartNoAxesColumn } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Page() {
    const [data, setData] = useState([])
    useEffect(() => {
        ToutiaoHotGET().then((result) => {
            setData(result.data)
        }).catch(() => {
            setData([])
        })
    })
    return (
        <div>    {data.length !== 0 && data.map((item: { url: string, title: string, hot_value: string }, idx: number) => (
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
        ))}</div>
    )
}
