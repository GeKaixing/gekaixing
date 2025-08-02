import { Separator } from "@/components/ui/separator"

export function LoginFooter() {
  return (
    <div className="w-full flex justify-center items-end absolute bottom-2 left-0">
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>关于</div>
        <Separator orientation="vertical" />
        <div>服务条款</div>
        <Separator orientation="vertical" />
        <div>隐私政策</div>
        <Separator orientation="vertical" />
        <div>Cookie 使用政策</div>
      </div>
    </div>
  )
}
