'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Github } from 'lucide-react' // 你可能是用这个 icon

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>

            <div
                className={`fixed top-0 w-full h-20 z-50 transition-colors duration-300 px-6 py-2 flex justify-between items-center ${scrolled ? 'bg-white shadow text-black' : 'bg-transparent text-white'
                    }`}
            >
                <div className='flex items-center gap-6'>
                    <Image alt='logo' src={'/logo.png'} width={32} height={32} />
                    <div className='font-bold text-2xl text-black'>Towel</div>
                </div>
                <div className='flex items-center gap-6 '>
                    <Link className='text-black'  href={'/account'}>登录</Link>
                    <Link href={'https://github.com/GeKaixing/towel'}>
                        <Github className='text-black'/>
                    </Link>
                </div>
            </div>
            <div className='w-full h-20'></div>
        </>
    )
}
