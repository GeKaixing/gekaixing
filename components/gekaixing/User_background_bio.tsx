'use client'

import Link from "next/link"
import { ShieldCheck } from "lucide-react"

import { userStore } from "@/store/user"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import UserEditDialog from "./UserEditDialog"

type UserBackgroundBioProps = {
  name?: string | null
  avatar?: string | null
  briefIntroduction?: string | null
  viewedUserid?: string | null
  followers?: number
  following?: number
  isOwner?: boolean
  isPremium: boolean
  isHiring?: boolean
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
  isHiring = false,
}: UserBackgroundBioProps) {
  const { userid: loginUserid } = userStore()
  const relationUserid = viewedUserid || loginUserid

  return (
    <>
      <div>
        <Avatar className="absolute size-36 -translate-y-1/2">
          <AvatarImage src={avatar || ""} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex">
        <div className="w-full" />
        {isOwner ? <UserEditDialog /> : <div className="h-9" />}
      </div>

      <div className="h-10 w-full" />
      <div className="mb-2 flex items-center gap-2 text-2xl font-bold">
        {name}
        <div>{isPremium && <ShieldCheck className="h-4 w-4 text-blue-500" />}</div>
        {isHiring ? <span className="text-sm font-semibold text-[#1D9BF0]">我们正在招人</span> : null}
      </div>

      {briefIntroduction ? (
        <div className="text-sm">{briefIntroduction}</div>
      ) : (
        <div className="text-sm">还没有介绍自己</div>
      )}

      <div className="cursor-pointer gap-2 text-sm flex">
        <Link href={`/gekaixing/following/${relationUserid}`} className="flex hover:underline">
          <div className="font-bold">{following}</div>
          正在关注
        </Link>
        <Link href={`/gekaixing/following/${relationUserid}`} className="flex hover:underline">
          <div className="font-bold">{followers}</div>
          关注者
        </Link>
      </div>

      <div className="h-5 w-full" />
    </>
  )
}
