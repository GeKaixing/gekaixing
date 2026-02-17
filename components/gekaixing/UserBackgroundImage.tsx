"use client"
import { Pen } from 'lucide-react'
import { useState } from 'react'
import Cropped from './Cropped'
import { userStore } from '@/store/user'

async function PATCHuser_background_imageFetch(url: string): Promise<Response> {
    return fetch('/api/user', {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            backgroundImage: url
        })
    })
}

export default function UserBackgroundImage() {
    const [open, setOpen] = useState(false)
    const { user_background_image } = userStore()    
    return (
        <>
            <div className="bg-gray-400 w-full h-[200px] flex justify-center items-center relative overflow-hidden">

                {/* 编辑按钮 */}
                <div
                    className="absolute z-10 w-8 h-8 flex justify-center items-center bg-white  hover:bg-gray-700 rounded-full cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    <Pen />
                </div>

                {/* 背景图 */}
                {user_background_image && (
                    <img
                        src={user_background_image}
                        alt="user background image"

                        className="object-cover"
                    />
                )}

            </div>

            <Cropped
                open={open}
                onOpenChange={setOpen}
                type="user-background-image"
                fetch={PATCHuser_background_imageFetch}
                user_background_image={user_background_image}
            />
        </>
    )
}
