"use client"
import { Pen } from 'lucide-react'
import React, { useState } from 'react'
import Cropped from './Cropped'
import { userStore } from '@/store/user'
import Image from 'next/image'

async function PATCHuser_background_imageFetch(url: string): Promise<Response> {
    const reslut = await fetch('/api/user', {
        method: 'PATCH',
        body: JSON.stringify({
            user_background_image: url
        })
    })
    return reslut
}
export default function UserBackgroundImage() {
    const [open, setOpen] = useState(false)
    const { user_background_image } = userStore()
    return (
        <>
            <div className='bg-gray-400 w-full h-[200px] flex justify-center items-center relative' >
                <div className='absolute z-2 w-8 h-8 flex justify-center items-center hover:bg-gray-700 rounded-full'
                    onClick={() => { setOpen(true) }}
                >
                    <Pen></Pen>

                </div>
{               user_background_image&& <Image className='object-cover full' fill priority src={user_background_image} alt='user background image' />
}
            </div >
            <Cropped
                open={open}
                onOpenChange={setOpen}
                type={'user-background-image'}
                fetch={PATCHuser_background_imageFetch}
                user_background_image={user_background_image}
            ></Cropped >
        </>
    )


}
