import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
    <div className='flex  flex-col justify-center items-center h-screen gap-6'>
      <Image src={'/logo.png'} width={200} height={200} alt='logo.png'></Image>
      <span className='  text-2xl text-red-500'>
        发生错误
      </span>
    </div>


  )
}
