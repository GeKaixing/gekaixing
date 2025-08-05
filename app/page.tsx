import Navbar from '@/components/towel/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='bg-blue-500'>
      <Navbar></Navbar>
      <div className='p-6 w-full h-screen flex items-center '>
        <footer className='w-full text-2xl  text-white  flex justify-between items-center max-sm:flex-col'>
          <Image alt='logo' src='/logo.png' width={200} height={200} className='cursor-pointer '></Image>
          <Link href={'/home'} className='text-5xl font-bold cursor-pointer '>Just for fun!!!</Link>
          <div className='flex flex-col gap-6 max-sm:hidden'>
            <div className='text-black font-semibold '>Towel</div>
            <Link href={'/about'} className='cursor-pointer '>关于</Link>
            <Link href={'/tos'} className='cursor-pointer '>服务条款</Link>
            <Link href={'/privacy'} className='cursor-pointer '>隐私政策</Link>
            <Link href={'/towel-cookies'} className='cursor-pointer '>Cookie 使用政策</Link>
          </div>
        </footer>
      </div>
      <div className='flex flex-col bg-blue-400 px-6 py-2 sm:hidden'>
        <div className='text-black font-semibold '>Towel</div>
        <Link href={'/about'} className='cursor-pointer '>关于</Link>
        <Link href={'/tos'} className='cursor-pointer '>服务条款</Link>
        <Link href={'/privacy'} className='cursor-pointer '>隐私政策</Link>
        <Link href={'/towel-cookies'} className='cursor-pointer '>Cookie 使用政策</Link>
      </div>
    </div>
  )
}
