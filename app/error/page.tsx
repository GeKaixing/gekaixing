import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='flex  flex-col justify-center items-center h-screen gap-6'>
      <Image src={'/logo.svg'} width={200} height={200} alt='logo.svg'></Image>
      <span className='  text-2xl text-red-500'>
        发生错误
      </span>
      <Link href='/account' replace className='h-9 border border-gray-300 rounded-2xl flex justify-center items-center w-2xs bg-black text-white'>返回</Link>
    </div>


  )
}
