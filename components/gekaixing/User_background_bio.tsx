'use client'

import { userStore } from "@/store/user"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import UserEditDialog from "./UserEditDialog"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"

type d = {
    name?: null | string
    avatar?: null | string
    briefIntroduction?: null | string
    viewedUserid?: string | null
    followers?: number
    following?: number
    isOwner?: boolean
    isPremium: boolean
}

export default function User_background_bio({
    isPremium,
    name,
    avatar,
    briefIntroduction,
    viewedUserid,
    followers = 0,
    following = 0,
    isOwner = false,
}: d) {
    const { userid: loginUserid } = userStore()
    const relationUserid = viewedUserid || loginUserid

    return (
        <>
            <div>
                <Avatar className="size-36 absolute  -translate-y-1/2 ">
                    <AvatarImage src={avatar || ''} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <div className='flex'>
                <div className='w-full'></div>

                {isOwner ? <UserEditDialog></UserEditDialog> : <div className="h-9"></div>}

            </div>
            <div className='w-full h-10'></div>
            <div className='font-bold text-2xl mb-2 flex items-center'>{name}
                <div>{isPremium&&<ShieldCheck className="w-4 h-4 text-blue-500" />}</div>
            </div>
            {briefIntroduction ? <div className='text-sm'>{briefIntroduction}</div> : <div className='text-sm'>{"还没有介绍自己"}</div>}
            <div className="flex gap-2 text-sm cursor-pointer">
                <Link href={`/imitation-x/following/${relationUserid}`} className="flex hover:underline">
                    <div className="font-bold ">{following} </div>正在关注
                </Link>
                <Link href={`/imitation-x/following/${relationUserid}`} className="flex hover:underline">
                    <div className="font-bold ">{followers}</div>关注者
                </Link>
            </div>

            <div className='w-full h-5'></div>
        </>
    )
}
