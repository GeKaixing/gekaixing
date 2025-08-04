import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export function LoginFooter() {
  return (
    <div className="w-full flex justify-center items-end absolute bottom-2 left-0">
      <div className="flex h-5 items-center space-x-4 text-sm">
        <Link href={'/about'}>关于</Link>
        <Separator orientation="vertical" />
        <Link href={'/tos'}>服务条款</Link>
        <Separator orientation="vertical" />
        <Link href={'/privacy'}>隐私政策</Link>
        <Separator orientation="vertical" />
        <Link href={'/towel-cookies'}>Cookie 使用政策</Link>
      </div>
    </div>
  )
}
