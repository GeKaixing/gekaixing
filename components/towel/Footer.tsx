'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ChartNoAxesColumn, Ellipsis, Search } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '../ui/separator'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,

    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import clsx from 'clsx'

export async function ToutiaoHotGET() {
    const res = await fetch('https://dabenshi.cn/other/api/hot.php?type=toutiaoHot', {
        method: 'GET',
    })
    const data = await res.json()
    return data
}

export default function Footer() {
    const [data, setData] = useState([])
    const [isActive, setACtive] = useState(false)


    useEffect(() => {
        ToutiaoHotGET().then((result) => {

            if (result.success) {
                setData(result.data)
            }
        }).catch((e) => {
            console.log(e)
            setData([])
        })
    }, [])

    return (
        <div className='space-y-2'>

            <div className={clsx('flex p-2 border-2  rounded-2xl', {
                "border-gray-200": !isActive,
                " border-blue-500": isActive
            })} onFocus={() => { setACtive(true) }}
                onBlur={() => { setACtive(false) }}
            >
                <Search></Search>
                <input
                    type='text'
                    placeholder='搜索'
                    className='border-0 focus:outline-none focus:ring-0 rounded-2xl'
                />
            </div>

            <div className='border-1 border-gray-200 p-2 rounded-2xl'>
                <span>今日头条</span>
                {data.length !== 0 && data.slice(1, 6).map((item: { url: string, title: string, hot_value: string }, idx: number) => (
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
                    <Link href='/home/explore' >
                        显示更多
                    </Link>
                </span>}
            </div>

            <div className="flex flex-col h-5 items-center  text-[12px] text-gray-400  cursor-pointer ">
                <div className='flex space-x-4'>
                    <div>关于</div>
                    <Separator orientation="vertical" />
                    <div>服务条款</div>
                    <Separator orientation="vertical" />
                    <div>隐私政策</div>
                    <Separator orientation="vertical" />
                    <div>Cookie 使用政策</div>
                </div>
                <div className='flex space-x-4 '>
                    <div>
                        辅助功能
                    </div>
                    <Separator orientation="vertical" />

                    <FooterDropdownMenu />

                    <Separator orientation="vertical" />
                </div>
            </div>

        </div>
    )
}




export function FooterDropdownMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className='flex items-center gap-1'>  更多 <Ellipsis size={12} /></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href={'https://github.com/GeKaixing/towel'}>github</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
