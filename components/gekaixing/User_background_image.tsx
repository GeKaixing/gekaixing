"use client"
import { userStore } from '@/store/user'
import Image from 'next/image'
import React from 'react'

export default function User_background_image() {
    const { user_background_image } = userStore()
    return (
        <div className='bg-gray-400 w-full h-[200px] relative'>
            {user_background_image && <Image
                src={user_background_image}
                alt="User background"
                fill // 让图片填满父容器
                priority
                className='object-cover w-full'  ></Image>}
        </div>
    )
}
