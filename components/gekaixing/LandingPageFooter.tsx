import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function LandingPageFooter({ className }: { className?: string }) {
    return (
        <footer className={clsx('w-full text-[16px]  text-white flex max-w-[80%] mx-auto', className)}>
            <div className='flex flex-col gap-6 text-gray-400'>
                <Image src='/logo.svg' width={64} height={64} alt='logo' ></Image>
                <Link href={'/about'} className='cursor-pointer '>关于</Link>
                <Link href={'/tos'} className='cursor-pointer '>服务条款</Link>
                <Link href={'/privacy'} className='cursor-pointer '>隐私政策</Link>
                <Link href={'/gekaixing-cookies'} className='cursor-pointer '>Cookie 使用政策</Link>
            </div>
            <div className='flex flex-col gap-4 text-gray-400'>
                <span className='text-[14px] font-bold text-black'>more</span>
                <div className='flex flex-col gap-6'>
                    <Link href={'/blog'} className='cursor-pointer '>博客</Link>
                    <Link href={'/curriculum-vitae.pdf'} className='cursor-pointer '>简历</Link>
                </div>
            </div>
        </footer>

    )
}
