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

export default function Sidebar({ user }: { user: { email: string | null, id: string | null, user_metadata: { avatar: string | null } } | null }) {
    const router = useRouter()

    userStore.setState({
        email: user?.email || '',
        id: user?.id || '',
        avatar: user?.user_metadata.avatar || ''
    })


    return (
        <nav className="w-[300px] h-screen flex justify-center  ">
            <ul className=" space-y-6">
                <li className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                    <House />
                    <Link href="/home">主页</Link></li>

                <li className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                    <Settings></Settings>
                    <Link href="/home/settings">设置</Link></li>

                {!user?.id ? <li className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                    <LogIn></LogIn>
                    <Link href="/account">登录</Link>
                </li> :
                    <li className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 items-center cursor-pointer ">

                        <Avatar onClick={() => router.push('/home/user')}>
                            <AvatarImage src={user?.user_metadata?.avatar||''} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <span className="text-[12px] text-gray-400" onClick={() => router.push('/home/user')}>{user.email}</span>

                        <SidebarDropdownMenu></SidebarDropdownMenu>
                    </li>}

                {/* <li className="rounded-2xl bg-black text-xl h-9 w-[200px] text-white flex justify-center items-center 
                hover:bg-black/80
                ">
                <Link href="/home/post">发布</Link></li> */}
                <EditPost></EditPost>
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
                <DropdownMenuItem onClick={logoutfetch}>登出 {email}</DropdownMenuItem>
                <DropdownMenuItem><Link href={`/home/user/${id}`}>个人信息</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyToClipboard(`http://localhost:3000/home/user/${id}`)}>复制连接</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
