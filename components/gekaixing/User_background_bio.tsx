'use client'

import Link from "next/link"
import { ShieldCheck } from "lucide-react"

import { userStore } from "@/store/user"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import UserEditDialog from "./UserEditDialog"

type UserBackgroundBioProps = {
  viewedUserId?: string | null
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
  viewedUserId,
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
        <Avatar className="absolute size-24 -translate-y-1/2 border-4 border-background sm:size-36">
          <AvatarImage src={avatar || ""} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex min-h-10 items-center">
        <div className="w-full" />
        {isOwner ? <UserEditDialog /> : <div className="h-9" />}
      </div>

      <div className="h-7 w-full sm:h-10" />
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="max-w-full break-words text-xl font-bold sm:text-2xl">{name}</span>
        {isPremium && <ShieldCheck className="h-4 w-4 text-blue-500" />}
        {isHiring && viewedUserId ? (
          <Link
            href={`/gekaixing/jobs?authorId=${viewedUserId}`}
            className="rounded-full bg-[#1D9BF0]/10 px-2 py-0.5 text-xs font-semibold text-[#1D9BF0] hover:underline sm:text-sm"
          >
            我们正在招人
          </Link>
        ) : null}
      </div>

      {briefIntroduction ? (
        <div className="text-sm leading-6">{briefIntroduction}</div>
      ) : (
        <div className="text-sm text-muted-foreground">还没有介绍自己</div>
      )}

      <div className="mt-2 flex cursor-pointer gap-4 text-sm">
        <Link href={`/gekaixing/following/${relationUserid}`} className="flex items-center gap-1 hover:underline">
          <div className="font-bold">{following}</div>
          <span className="text-muted-foreground">正在关注</span>
        </Link>
        <Link href={`/gekaixing/following/${relationUserid}`} className="flex items-center gap-1 hover:underline">
          <div className="font-bold">{followers}</div>
          <span className="text-muted-foreground">关注者</span>
        </Link>
      </div>

      <div className="h-3 w-full sm:h-5" />
    </>
  )
}
