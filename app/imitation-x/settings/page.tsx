"use client"
import ArrowLeftBack from '@/components/gekaixing/ArrowLeftBack'
import SettingLi from '@/components/gekaixing/SettingLi'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { userStore } from '@/store/user'
import { ChevronRight, SpadeIcon, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {
  const { name, user_avatar, email } = userStore()
  return (
    <div>
      <ArrowLeftBack></ArrowLeftBack>
      <div className='w-full flex  justify-center items-center'>
        <div className='flex flex-col items-center'>
          <Avatar>
            <AvatarImage src={user_avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className='text-2xl font-bold'>{name}</span>
          <span className='text-[12px]'>{email}</span>
        </div>
      </div>
      <ul>
        <SettingLi
          icon={<User></User>}
          text='账号'
        ></SettingLi>

      </ul>

    </div>
  )
}
