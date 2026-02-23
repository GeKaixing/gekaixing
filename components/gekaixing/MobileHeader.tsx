"use client"
import { AlignJustify, House, LogIn, Search, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import SidebarAvatar from './SidebarAvatar'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { userResult } from '@/app/imitation-x/layout'
import { useTranslations } from 'next-intl'

export default function MobileHeader({ user }: { user: userResult | null }) {
    const t = useTranslations("ImitationX.Mobile")
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
            <div className='w-full fixed top-0 h-20 px-6 py-2 flex justify-between items-center bg-background/90 backdrop-blur border-b border-border'>
                <MobileDrawer user={user} />
                <>
                    <Image src='/logo.svg' width={24} height={12} alt='logo' className='dark:hidden'></Image>
                    <Image src='/logo-white.svg' width={24} height={12} alt='logo white' className='hidden dark:block'></Image>
                </>
                <Link href={'/imitation-x/explore'} data-value={t("search")}><Search></Search></Link>
            </div>
            <div className='w-full  h-20'></div>
        </div>

    )
}

function MobileDrawer({ user }: { user: userResult | null }) {
    const t = useTranslations("ImitationX.Mobile")


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
                                    <AvatarImage src={user?.avatar || user.avatar || ''} />
                                    <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>{user.name}</div>
                                <div>{user.email}</div>
                            </Link>
                        }
                        <nav className="w-full h-screen flex justify-center  mt-4">
                            <ul className=" space-y-6 w-full">
                                <Link href="/imitation-x" className="flex gap-2 text-xl font-bold hover:bg-muted/70 rounded-2xl p-2 transition-colors">
                                    <House />
                                    <span >{t("home")}</span>
                                </Link>
                                {user?.id &&
                                    <Link href="/imitation-x/settings" className="flex gap-2 text-xl font-bold hover:bg-muted/70 rounded-2xl p-2 transition-colors">
                                        <Settings></Settings>
                                        <span>{t("settings")}</span>
                                    </Link>}

                                {!user?.id ?
                                    <Link href="/account" className="flex gap-2 text-xl font-bold hover:bg-muted/70 rounded-2xl p-2 transition-colors">
                                        <LogIn></LogIn>
                                        <span>{t("login")}</span>
                                    </Link> :
                                    <SidebarAvatar></SidebarAvatar>
                                }

                                {user?.id && <Link
                                    href={'/imitation-x/post'}
                                    className="rounded-2xl bg-primary text-xl h-9 w-[200px] text-primary-foreground flex justify-center items-center hover:opacity-90 cursor-pointer transition-opacity"
                                >
                                    {t("publish")}
                                </Link>}
                            </ul>
                        </nav>

                    </SheetHeader>
                </SheetContent>
            </Sheet >
        </div>
    )
}
