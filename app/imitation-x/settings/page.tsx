"use client"
import ArrowLeftBack from '@/components/gekaixing/ArrowLeftBack'
import SettingLi from '@/components/gekaixing/SettingLi'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { userStore } from '@/store/user'
import { ChevronRight, Info, User,HandHelping } from 'lucide-react'

export default function page() {
  const { name, user_avatar, email } = userStore()
  return (
    <div>
      <ArrowLeftBack name='设置'></ArrowLeftBack>
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
        <SettingLi
          icon={<HandHelping/>}
          text='帮助中心'
          href='/imitation-x/help'
        ></SettingLi>
        <SettingLi
          icon={<Info></Info>}
          text='关于'
          href='/about'
        ></SettingLi>
      </ul>

    </div>
  )
}
