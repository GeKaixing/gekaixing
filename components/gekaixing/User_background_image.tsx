"use client"
import { userStore } from '@/store/user'
import Image from 'next/image'

export default function User_background_image({ backgroundImage }: { backgroundImage: string | null|undefined }) {
    return (
        <div className='bg-gray-400 w-full h-[200px] relative'>
            {backgroundImage && <Image
                src={backgroundImage}
                alt="User background"
                fill // 让图片填满父容器
                priority
                className='object-cover w-full'  ></Image>}
        </div>
    )
}
