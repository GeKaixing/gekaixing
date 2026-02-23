"use client"
import ArrowLeftBack from '@/components/gekaixing/ArrowLeftBack'
import SettingLi from '@/components/gekaixing/SettingLi'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { userStore } from '@/store/user'
import { Info, User,HandHelping, Palette, Languages } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Page() {
  const t = useTranslations("ImitationX.Settings")
  const { name, user_avatar, email } = userStore()
  return (
    <div>
      <ArrowLeftBack name={t("title")}></ArrowLeftBack>
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
          text={t("account")}
        ></SettingLi>
        <SettingLi
          icon={<Palette />}
          text={t("theme")}
          href='/imitation-x/settings/theme'
        ></SettingLi>
        <SettingLi
          icon={<Languages />}
          text={t("language")}
          href='/imitation-x/settings/language'
        ></SettingLi>
        <SettingLi
          icon={<HandHelping/>}
          text={t("help")}
          href='/imitation-x/help'
        ></SettingLi>
        <SettingLi
          icon={<Info></Info>}
          text={t("about")}
          href='/about'
        ></SettingLi>
      </ul>

    </div>
  )
}
