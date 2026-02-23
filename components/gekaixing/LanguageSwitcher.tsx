"use client"

import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type Locale = "en" | "zh-CN"

const LOCALES: Locale[] = ["en", "zh-CN"]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()

  function handleSwitch(nextLocale: Locale): void {
    if (nextLocale === locale) return

    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`
    router.refresh()
  }

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background/90 p-1">
      {LOCALES.map((item) => {
        const active = item === locale
        return (
          <button
            key={item}
            type="button"
            onClick={() => handleSwitch(item)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
          >
            {item === "en" ? "EN" : "中文"}
          </button>
        )
      })}
    </div>
  )
}
