"use client"
import { AlignJustify, House, LogIn, Search, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import SidebarAvatar from './SidebarAvatar'
import { userStore } from '@/store/user'
import { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MobileHeader({ user }: { user: User | null }) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    if (scrolled) return null;
    return (
        <div className='sm:hidden'>
            <div className=' w-full fixed top-0 h-20 px-6 py-2 flex justify-between items-center '>
                <MobileDrawer user={user} />
                <Image src='/logo.svg' width={24} height={12} alt='logo'></Image>
                <Link href={'/imitation-x/explore'} data-value={'search'}><Search></Search></Link>
            </div>
            <div className='w-full  h-20'></div>
        </div>

    )
}
function MobileDrawer({ user }: { user: User | null }) {
    useEffect(() => {
        async function fetchUserData() {
            if (user) {
                try {
                    const res = await fetch('/api/user', { method: 'GET' })
                    const data = await res.json()
                    
                    userStore.setState({
                        email: user.email || '',
                        id: user.id || '',
                        name: user.user_metadata.name || '',
                        user_background_image: user.user_metadata.user_background_image || '',
                        user_avatar: user.user_metadata.user_avatar || user.user_metadata.avatar_url || '',
                        brief_introduction: user.user_metadata.brief_introduction || '',
                        userid: data.userid || '',
                    });
                } catch (error) {
                    userStore.setState({
                        email: user.email || '',
                        id: user.id || '',
                        name: user.user_metadata.name || '',
                        user_background_image: user.user_metadata.user_background_image || '',
                        user_avatar: user.user_metadata.user_avatar || user.user_metadata.avatar_url || '',
                        brief_introduction: user.user_metadata.brief_introduction || '',
                    });
                }
            }
        }
        fetchUserData()
    }, [user]);


    return (
        <div className='sm:hidden'>
            <Sheet>
                <SheetTrigger>  <AlignJustify /></SheetTrigger>
                <SheetContent side="left" >
                    <SheetHeader>
                        <SheetTitle className='hidden'></SheetTitle>
                        <SheetDescription className='hidden'> </SheetDescription>
                        {user?.id &&
                            <Link href={`/imitation-x/user/${user.id}`}>
                                <Avatar>
                                    <AvatarImage src={user?.user_metadata.user_avatar || user?.user_metadata.avatar_url || ''} />
                                    <AvatarFallback>{user.user_metadata.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>{user.user_metadata.name}</div>
                                <div>{user.email}</div>
                            </Link>
                        }
                        <nav className="w-full h-screen flex justify-center  mt-4">
                            <ul className=" space-y-6 w-full">
                                <Link href="/imitation-x" className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                                    <House />
                                    <span >主页</span>
                                </Link>
                                {user?.id &&
                                    <Link href="/imitation-x/settings" className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
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

                                {user?.id && <Link
                                    href={'/imitation-x/post'}
                                    className="rounded-2xl bg-black text-xl h-9 w-[200px] text-white flex justify-center items-center hover:bg-black/80 cursor-pointer"
                                >
                                    发布
                                </Link>}
                            </ul>
                        </nav>

                    </SheetHeader>
                </SheetContent>
            </Sheet >
        </div>
    )
}