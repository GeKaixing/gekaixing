'use client'
import React, { useState } from 'react'
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar'
import Cropped from './Cropped'
import { userStore } from '@/store/user'
import { Pen } from 'lucide-react'
async function PATCHuser_background_imageFetch(url: string): Promise<Response> {
    const reslut = await fetch('/api/user', {
        method: 'PATCH',
        body: JSON.stringify({
            user_avatar: url
        })
    })
    return reslut
}
export default function UserAvatar() {
    const [open, setOpen] = useState(false)
    const { user_avatar } = userStore()
    return (
        <div >
            <Avatar className="size-36 absolute border-4 border-white -translate-y-1/2">
                <div className='relative'>
                    <AvatarImage src={user_avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                    {/* ⚠️ 这里是修改的地方 */}
                    <div className=' absolute z-20 w-8 h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center hover:bg-gray-700 rounded-full'
                        onClick={() => { setOpen(true) }}
                    >
                        <Pen></Pen>
                    </div>
                </div>
            </Avatar>
            <Cropped
                open={open}
                onOpenChange={setOpen}
                type={'use-avatar'}
                fetch={PATCHuser_background_imageFetch}
                user_avatar={user_avatar}
            ></Cropped>
        </div>
    )
}
