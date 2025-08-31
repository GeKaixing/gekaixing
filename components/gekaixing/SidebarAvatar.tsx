import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { SidebarDropdownMenu } from './Sidebar'
import { userStore } from '@/store/user'
import { useRouter } from 'next/navigation'

export default function SidebarAvatar() {   
    const router=useRouter()
    const {user_avatar,name,email,id}=userStore()

    return (
        <li className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 items-center cursor-pointer ">

            <Avatar onClick={() => router.push('/imitation-x/user')}>
                <AvatarImage src={user_avatar || ''} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                {
                   name && <span className="text-[12px] text-gray-700" onClick={() => router.push(`/imitation-x/user/${id}`)}>  {name}</span>
                }
                <span className="text-[12px] text-gray-400" onClick={() => router.push(`/imitation-x/user/${id}`)}>{email}</span>

            </div>

            <SidebarDropdownMenu></SidebarDropdownMenu>
        </li>
    )
}
