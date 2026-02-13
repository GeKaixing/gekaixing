'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Github } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'

interface NavbarProps {
    user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false)
    const [isActive, setACtive] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        if (pathname !== '/') {
            setACtive(true)
        }
        return () => {
            setACtive(false)
        }
    }, [pathname])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const avatarUrl = user?.user_metadata?.user_avatar || user?.user_metadata?.avatar_url || ''
    const userName = user?.user_metadata?.name || ''
    const userEmail = user?.email || ''
    const fallbackInitial = userName?.charAt(0)?.toUpperCase() || userEmail?.charAt(0)?.toUpperCase() || 'U'
    const userId = user?.id || ''

    return (
        <>
            <div
                className={`fixed top-0 w-full h-20 z-50 transition-colors duration-300 px-6 py-2 flex justify-between items-center ${scrolled ? 'bg-white shadow text-black' : 'bg-transparent text-black'
                    }`}
            >
                <div className='flex items-center gap-6'>
                    <Link href={'/'}>
                        <Image alt='logo' src={'/logo.svg'} width={64} height={64} />
                    </Link>
                </div>
                <div className='flex items-center gap-6 '>
                    {!user?.id ? (
                        <Link className='text-black' href={'/account'}>login</Link>
                    ) : (
                        <div 
                            className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-full px-2 py-1 transition-colors'
                            onClick={() => router.push(`/imitation-x/user/${userId}`)}
                        >
                            <Avatar className='w-8 h-8'>
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback>{fallbackInitial}</AvatarFallback>
                            </Avatar>
                            <span className='text-sm font-medium text-black'>{userName || userEmail}</span>
                        </div>
                    )}
                    <Link href={'https://github.com/GeKaixing/towel'}>
                        <Github className='text-black' />
                    </Link>
                </div>
            </div>
            <div className='w-full h-20'></div>
        </>
    )
}
