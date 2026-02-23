"use client"
import React from 'react'
import { Ellipsis } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '../ui/separator'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,

    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Ablout() {
    return (
        <div className="flex flex-col h-5 items-center  text-[12px] text-gray-400  cursor-pointer ">
            <div className='flex space-x-4'>
                <Link href={'/about'}>关于</Link>
                <Separator orientation="vertical" />
                <Link href={'/tos'}>服务条款</Link>
                <Separator orientation="vertical" />
                <Link href={'/privacy'}>隐私政策</Link>
                <Separator orientation="vertical" />
                <Link href={'/help'}>帮助中心</Link>
                <Separator orientation="vertical" />
                <Link href={'/cookies'}>Cookie 使用政策</Link>
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
                    <Link href={'https://github.com/GeKaixing/gekaixing'}>github</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
