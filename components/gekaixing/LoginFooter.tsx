import { Separator } from "@/components/ui/separator"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export async function LoginFooter() {
  const t = await getTranslations("Account.Footer")

  return (
    <div className="w-full flex justify-center items-end absolute bottom-2 left-0">
      <div className="flex h-5 items-center space-x-4 text-sm">
        <Link href={'/about'}>{t("about")}</Link>
        <Separator orientation="vertical" />
        <Link href={'/tos'}>{t("termsOfService")}</Link>
        <Separator orientation="vertical" />
        <Link href={'/privacy'}>{t("privacyPolicy")}</Link>
        <Separator orientation="vertical" />
        <Link href={'/gekaixing-cookies'}>{t("cookiePolicy")}</Link>
      </div>
    </div>
  )
}
