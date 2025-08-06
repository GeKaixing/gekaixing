'use client'
import { userStore } from "@/store/user";
import { House, LogIn, Settings } from "lucide-react";
import Link from "next/link";
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
import { useEffect } from "react";
import { User } from '@supabase/supabase-js'
import SidebarAvatar from "./SidebarAvatar";
import EditPost from "./EditPost";

export default function Sidebar({ user }: { user: User | null }) {


    // 使用 useEffect 在 user 发生变化时同步状态
    useEffect(() => {
        // 确保 user 对象存在，以避免在用户未登录时出现错误
        if (user) {
            userStore.setState({
                email: user.email || '',
                id: user.id || '',
                name: user.user_metadata.name || '',
                user_background_image: user.user_metadata.user_background_image || '',
                user_avatar: user.user_metadata.user_avatar || '',
                brief_introduction: user.user_metadata.brief_introduction || ''
            });
        }
    }, [user]); // 依赖数组，只有当 user 对象引用发生变化时才执行


    return (
        <nav className="w-[300px] h-screen flex justify-center  ">
            <ul className=" space-y-6">
                <Link href="/home" className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                    <House />
                    <span >主页</span>
                </Link>
                {user?.id &&
                    <Link href="/home/settings" className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                        <Settings></Settings>
                        <span>设置</span>
                    </Link>}

                {!user?.id ?
                    <Link href="/account" className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                        <LogIn></LogIn>
                        <span>登录</span>
                    </Link> :
                    <SidebarAvatar></SidebarAvatar>
                }

                {/* {user?.id && <Link
                    href={'/home/post'}
                    className="rounded-2xl bg-black text-xl h-9 w-[200px] text-white flex justify-center items-center hover:bg-black/80 cursor-pointer"
                >
                    发布
                </Link>} */}
                {user?.id &&<EditPost></EditPost>}
            </ul>
        </nav>
    )
}

async function logoutfetch() {
    const result = await fetch('/api/logout', { method: 'POST' })
    return result
}

export function SidebarDropdownMenu() {
    const { email, id } = userStore((state) => state)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <Link href="/account"><DropdownMenuItem onClick={logoutfetch}>登出 {email}</DropdownMenuItem></Link>
                <Link href={`/home/user/${id}`}><DropdownMenuItem>个人信息</DropdownMenuItem></Link>
                <DropdownMenuItem onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_URL}/home/user/${id}`)}>复制连接</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
