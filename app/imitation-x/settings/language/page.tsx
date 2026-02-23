"use client"

import ArrowLeftBack from "@/components/gekaixing/ArrowLeftBack"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Locale = "en" | "zh-CN"

export default function Page() {
  const t = useTranslations("ImitationX.Language")
  const locale = useLocale()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function handleSwitch(nextLocale: Locale): void {
    if (nextLocale === locale) return

    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`
    router.refresh()
  }

  return (
    <div>
      <ArrowLeftBack name={t("title")} />
      <div className="px-4 py-3 space-y-3">
        {[
          {
            key: "zh-CN" as Locale,
            title: t("zh.title"),
            description: t("zh.description"),
          },
          {
            key: "en" as Locale,
            title: t("en.title"),
            description: t("en.description"),
          },
        ].map((item) => {
          const isActive = mounted && locale === item.key

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleSwitch(item.key)}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-colors",
                "bg-background border-border hover:bg-muted/60",
                isActive && "border-primary"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
                {isActive ? <Check className="text-primary shrink-0" size={18} /> : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
