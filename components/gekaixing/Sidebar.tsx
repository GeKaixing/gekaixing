'use client'
import { userStore } from "@/store/user";
import { postModalStore } from "@/store/postModal";
import { MessageSquare, House, LogIn, Settings, Users, Search, RailSymbol, CircleEllipsis, Heart, Bookmark, Feather, User as UserIcon, ShieldCheck } from "lucide-react";
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
import { copyToClipboard } from "@/utils/function/copyToClipboard";
import SidebarAvatar from "./SidebarAvatar";
import EditPost from "./EditPost";
import { userResult } from "@/app/imitation-x/layout";

export default function Sidebar({ user }: { user: userResult | null }) {
    const { openModal } = postModalStore()
    userStore.setState({
        email: user?.email || '',
        id: user?.id || '',
        name: user?.name || 'anonymity',
        user_background_image: user?.backgroundImage || '',
        user_avatar: user?.avatar || '',
        brief_introduction: user?.briefIntroduction || '',
        userid: user?.userid || '',
        followers: user?._count.followers, // 被关注数
        following: user?._count.following, // 关注数
    });

    return (
        <nav className="w-full h-screen flex justify-end px-2 lg:pr-4">
            <div className="flex flex-col h-full w-full lg:w-[200px]">
                <ul className="space-y-1 flex flex-col items-center lg:items-start">
                    <li className="w-full">
                        <Link href="/imitation-x" className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 text-xl font-bold hover:bg-gray-50 rounded-full p-3 w-full">
                            <House className="w-7 h-7" />
                            <span className="hidden lg:inline">主页</span>
                        </Link>
                    </li>
                    <li className="w-full">
                        <Link href="/imitation-x/chat" className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 text-xl font-bold hover:bg-gray-50 rounded-full p-3 w-full">
                            <MessageSquare className="w-7 h-7" />
                            <span className="hidden lg:inline">聊天</span>
                        </Link>
                    </li>
                    <li className="w-full">
                        <Link href="/imitation-x/connect_people" className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 text-xl font-bold hover:bg-gray-50 rounded-full p-3 w-full">
                            <Users className="w-7 h-7" />
                            <span className="hidden lg:inline">关注</span>
                        </Link>
                    </li>
                    <li className="w-full">
                        <Link href="/imitation-x/explore" className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 text-xl font-bold hover:bg-gray-50 rounded-full p-3 w-full">
                            <Search className="w-7 h-7" />
                            <span className="hidden lg:inline">探索</span>
                        </Link>
                    </li>
                    <li className="w-full">
                        <Link href="/imitation-x/gkx" className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 text-xl font-bold hover:bg-gray-50 rounded-full p-3 w-full">
                            <RailSymbol className="w-7 h-7" />
                            <span className="hidden lg:inline">GKX</span>
                        </Link>
                    </li>
                    <li className="w-full">
                        <Link href="/imitation-x/premium" className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 text-xl font-bold hover:bg-gray-50 rounded-full p-3 w-full">
                            <ShieldCheck className="w-7 h-7" />
                            <span className="hidden lg:inline">premium</span>
                        </Link>
                    </li>

                    <li className="w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 text-xl font-bold hover:bg-gray-50 rounded-full p-3 w-full cursor-pointer">
                                    <CircleEllipsis className="w-7 h-7" />
                                    <span className="hidden lg:inline">更多</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href="/imitation-x/likes" className="flex items-center gap-2 cursor-pointer">
                                        <Heart className="w-4 h-4" />
                                        <span>喜欢</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/imitation-x/bookmarks" className="flex items-center gap-2 cursor-pointer">
                                        <Bookmark className="w-4 h-4" />
                                        <span>收藏</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </li>

                    {user?.id && (
                        <li className="w-full">
                            <Link href="/imitation-x/settings" className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 text-xl font-bold hover:bg-gray-50 rounded-full p-3 w-full">
                                <Settings className="w-7 h-7" />
                                <span className="hidden lg:inline">设置</span>
                            </Link>
                        </li>
                    )}
                    {user?.id && (
                        <li className="w-full">
                            <Link href={`/imitation-x/user/${user?.id}`} className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 text-xl font-bold hover:bg-gray-50 rounded-full p-3 w-full">
                                <UserIcon className="w-7 h-7" />
                                <span className="hidden lg:inline">个人信息</span>
                            </Link>
                        </li>
                    )}

                    {user?.id && (
                        <li className="w-full mt-4 flex justify-center items-center">
                            <button
                                onClick={openModal}
                                className="w-12 h-12 lg:w-full lg:h-auto lg:py-3 bg-black text-white rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
                            >
                                <Feather className="w-5 h-5 lg:hidden" />
                                <span className="hidden lg:inline font-bold text-lg">发布</span>
                            </button>
                        </li>
                    )}

                    {!user?.id ? (
                        <li className="w-full">
                            <Link href="/account" className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 text-xl font-bold hover:bg-gray-50 rounded-full p-3 w-full">
                                <LogIn className="w-7 h-7" />
                                <span className="hidden lg:inline">登录</span>
                            </Link>
                        </li>
                    ) : null}
                </ul>

                {user?.id && (
                    <div className="mt-auto mb-4 w-full flex justify-center  items-center ">
                        <SidebarAvatar />
                    </div>
                )}

                {user?.id && <EditPost />}
            </div>
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
                <Link href={`/imitation-x/user/${id}`}><DropdownMenuItem>个人信息</DropdownMenuItem></Link>
                <DropdownMenuItem onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_URL}/imitation-x/user/${id}`)}>复制连接</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
