'use client'

import { userStore } from "@/store/user"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import UserEditDialog from "./UserEditDialog"

export default function User_background_bio() {
    const {  name, user_avatar, brief_introduction } = userStore()
    return (
        <>
            <div>
                <Avatar className="size-36 absolute  -translate-y-1/2 ">
                    <AvatarImage src={user_avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <div className='flex'>
                <div className='w-full'></div>
                <UserEditDialog></UserEditDialog>
            </div>
            <div className='w-full h-10'></div>
            <div className='font-bold text-2xl mb-2'>{name}</div>
            {brief_introduction ? <div className='text-sm'>{brief_introduction}</div> : <div className='text-sm'>{"还没有介绍自己"}</div>}
            <div className='w-full h-5'></div>
        </>
    )
}
