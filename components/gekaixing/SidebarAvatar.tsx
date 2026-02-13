import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { SidebarDropdownMenu } from './Sidebar'
import { userStore } from '@/store/user'
import { useRouter } from 'next/navigation'

export default function SidebarAvatar() {
    const router = useRouter()
    const { user_avatar, name, email, id } = userStore()

    const avatarUrl = user_avatar || ''
    const fallbackInitial = name?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || 'U'

    return (
        <li className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-full p-2 items-center cursor-pointer w-full">
            <Avatar onClick={() => router.push('/imitation-x/user')} className="w-10 h-10 shrink-0">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{fallbackInitial}</AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col flex-1 min-w-0">
                {name && <span className="text-sm font-bold text-gray-900 truncate" onClick={() => router.push(`/imitation-x/user/${id}`)}>{name}</span>}
                <span className="text-sm text-gray-500 truncate" onClick={() => router.push(`/imitation-x/user/${id}`)}>{email}</span>
            </div>
            <div className="hidden lg:block">
                <SidebarDropdownMenu />
            </div>
        </li>
    )
}
