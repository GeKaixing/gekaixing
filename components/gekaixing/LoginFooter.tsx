import { Separator } from "@/components/ui/separator"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export async function LoginFooter() {
  const t = await getTranslations("Account.Footer")

  return (
    <div className="w-full px-4 pb-4 sm:pb-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
        <Link href={'/about'} className="hover:underline">{t("about")}</Link>
        <Separator orientation="vertical" />
        <Link href={'/tos'} className="hover:underline">{t("termsOfService")}</Link>
        <Separator orientation="vertical" />
        <Link href={'/privacy'} className="hover:underline">{t("privacyPolicy")}</Link>
        <Separator orientation="vertical" />
        <Link href={'/cookies'} className="hover:underline">{t("cookiePolicy")}</Link>
      </div>
    </div>
  )
}
