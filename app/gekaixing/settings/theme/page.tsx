"use client"

import ArrowLeftBack from "@/components/gekaixing/ArrowLeftBack"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

type ThemeMode = "light" | "dark" | "system"

export default function Page() {
  const t = useTranslations("ImitationX.Theme")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeTheme = (theme as ThemeMode | undefined) || "system"
  const themeOptions: { key: ThemeMode; title: string; description: string }[] = [
    {
      key: "light",
      title: t("light.title"),
      description: t("light.description"),
    },
    {
      key: "dark",
      title: t("dark.title"),
      description: t("dark.description"),
    },
    {
      key: "system",
      title: t("system.title"),
      description: t("system.description"),
    },
  ]

  return (
    <div>
      <ArrowLeftBack name={t("title")} />
      <div className="px-4 py-3 space-y-3">
        {themeOptions.map((option) => {
          const isActive = mounted && activeTheme === option.key

          return (
            <button
              type="button"
              key={option.key}
              onClick={() => setTheme(option.key)}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-colors",
                "bg-background border-border hover:bg-muted/60",
                isActive && "border-primary"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{option.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                {isActive ? (
                  <Check className="text-primary shrink-0" size={18} />
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
