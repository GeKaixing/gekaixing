'use client'

import { userStore } from "@/store/user"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import UserEditDialog from "./UserEditDialog"
import Link from "next/link"

type d = {
    name?: null | string
    avatar?: null | string
    briefIntroduction?: null | string
    userId: string | null | undefined
}

export default function User_background_bio({ name, avatar, briefIntroduction, userId }: d) {
    const { userid,
        followers, // 被关注数
        following } = userStore()
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

                {userId === userid ? <UserEditDialog></UserEditDialog> : <div className="h-9"></div>}

            </div>
            <div className='w-full h-10'></div>
            <div className='font-bold text-2xl mb-2'>{name}</div>
            {briefIntroduction ? <div className='text-sm'>{briefIntroduction}</div> : <div className='text-sm'>{"还没有介绍自己"}</div>}
            <div className="flex gap-2 text-sm cursor-pointer">
                <Link href={`/imitation-x/following/${userid}`} className="flex hover:underline">
                    <div className="font-bold ">{following} </div>正在关注
                </Link>
                <Link href={`/imitation-x/following/${userid}`} className="flex hover:underline">
                    <div className="font-bold ">{followers}</div>关注者
                </Link>
            </div>

            <div className='w-full h-5'></div>
        </>
    )
}
