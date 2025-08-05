'use client'
import { userStore } from "@/store/user";
import { House, LogIn, Settings } from "lucide-react";
import Link from "next/link";
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
import EditPost from "./EditPost";
import { useEffect } from "react";

export default function Sidebar({ user }: { user: { email: string | null, id: string | null, user_metadata: { avatar: string | null, name: string | null, user_background_image: string | null, user_avatar: string | null } } | null }) {
    const router = useRouter()

  
    // 使用 useEffect 在 user 发生变化时同步状态
    useEffect(() => {
        // 确保 user 对象存在，以避免在用户未登录时出现错误
        if (user) {
            userStore.setState({
                email: user.email || '',
                id: user.id || '',
                name: user.user_metadata.name || '',
                user_background_image: user.user_metadata.user_background_image || '',
                user_avatar: user.user_metadata.user_avatar || ''
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
                <Link href="/home/settings" className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                    <Settings></Settings>
                    <span>设置</span>
                </Link>

                {!user?.id ?
                    <Link href="/account" className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                        <LogIn></LogIn>
                        <span>登录</span>
                    </Link> :
                    <li className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 items-center cursor-pointer ">

                        <Avatar onClick={() => router.push('/home/user')}>
                            <AvatarImage src={user?.user_metadata?.user_avatar || ''} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            {
                                user?.user_metadata.name && <span className="text-[12px] text-gray-700" onClick={() => router.push(`/home/user/${user.id}`)}>  {user?.user_metadata.name}</span>
                            }
                            <span className="text-[12px] text-gray-400" onClick={() => router.push(`/home/user/${user.id}`)}>{user.email}</span>

                        </div>

                        <SidebarDropdownMenu></SidebarDropdownMenu>
                    </li>}


                <Link
                    href={'/home/post'}
                    className="rounded-2xl bg-black text-xl h-9 w-[200px] text-white flex justify-center items-center hover:bg-black/80 cursor-pointer"
                >
                    发布 
                </Link>
                {/* <EditPost></EditPost> */}
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
                <DropdownMenuItem onClick={() => copyToClipboard(`http://localhost:3000/home/user/${id}`)}>复制连接</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
