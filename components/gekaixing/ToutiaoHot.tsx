"use client"

import { ChartNoAxesColumn } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

type HotItem = {
  url: string
  title: string
  hot_value: string
}

export default function ToutiaoHot() {
  const t = useTranslations("ImitationX.Hot")
  const [list, setList] = useState<HotItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadHot(): Promise<void> {
      try {
        const res = await fetch("/api/toutiao-hot")
        if (!res.ok) {
          if (!cancelled) {
            setList([])
          }
          return
        }

        const json = (await res.json()) as { data?: HotItem[] }
        if (!cancelled) {
          setList(Array.isArray(json.data) ? json.data : [])
        }
      } catch (error) {
        console.error(t("loadFailed"), error)
        if (!cancelled) {
          setList([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadHot()

    return () => {
      cancelled = true
    }
  }, [t])

  if (loading) {
    return (
        <div className="border p-2 rounded-2xl text-muted-foreground bg-background">
        {t("loading")}
      </div>
    )
  }

  if (list.length === 0) {
    return (
      <div className="border p-2 rounded-2xl text-muted-foreground bg-background">
        {t("empty")}
      </div>
    )
  }

  return (
    <div className="border p-2 rounded-2xl">
      <span className="font-semibold">{t("title")}</span>

      {list.slice(1, 6).map((item, idx) => (
        <Link
          href={item.url}
          key={idx}
          target="_blank"
          rel="noopener noreferrer"
          className="flex py-1 flex-col justify-start hover:bg-muted/70 cursor-pointer rounded-2xl p-1 transition-colors"
        >
          <span className="line-clamp-2">{item.title}</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <ChartNoAxesColumn size={14} />
            <span>{item.hot_value}</span>
          </div>
        </Link>
      ))}

      <Link
        href="/imitation-x/explore"
        className="text-blue-600 dark:text-blue-400 block mt-2 hover:underline"
      >
        {t("more")}
      </Link>
    </div>
  )
}
