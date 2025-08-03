'use client'
import { userStore } from "@/store/user";
import { createClient } from "@/utils/supabase/client";
import { House, LogIn, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from 'lucide-react'
import { useRouter } from "next/navigation";
import { copyToClipboard } from "@/utils/function/copyToClipboard";
export default function Sidebar() {
    const router = useRouter()

    useEffect(() => {
        async function getUser() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser()
            userStore.setState({
                email: user?.email || '',
                id: user?.id || '',
                avatar: user?.user_metadata.avatar || ''
            })
        }

        getUser();

    }, [])

    const { id, avatar, email } = userStore((state) => state)

    return (
        <nav className="w-[300px] h-screen flex justify-center  ">
            <ul className=" space-y-6">
                <li className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                    <House />
                    <Link href="/home">主页</Link></li>

                <li className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                    <Settings></Settings>
                    <Link href="/home/settings">设置</Link></li>

                {!id ? <li className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                    <LogIn></LogIn>
                    <Link href="/account">登录</Link>
                </li> :
                    <li className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 items-center cursor-pointer ">

                        <Avatar onClick={() => router.push('/home/user')}>
                            <AvatarImage src={avatar} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <span className="text-[12px] text-gray-400" onClick={() => router.push('/home/user')}>{email}</span>

                        <SidebarDropdownMenu></SidebarDropdownMenu>
                    </li>}

                <li className="rounded-2xl bg-black text-xl h-9 w-[200px] text-white flex justify-center items-center 
                hover:bg-black/80
                "><Link href="/home/post">发布</Link></li>
            </ul>
        </nav>
    )
}

async function logoutfetch() {
    const result = await fetch('/api/logout', { method: 'POST' })
    return result
}

export function SidebarDropdownMenu() {
    const { email,id } = userStore((state) => state)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={logoutfetch}>登出 {email}</DropdownMenuItem>
                <DropdownMenuItem>修改头像</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>copyToClipboard(`http://localhost:3000/home/user/${id}`)}>复制连接</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
