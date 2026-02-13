"use server"

import { ChartNoAxesColumn } from "lucide-react"
import Link from "next/link"

export async function ToutiaoHotGTE() {
  try {
    return await fetch("https://corsproxy.io/?https://dabenshi.cn/other/api/hot.php?type=toutiaoHot", {
      method: "GET",
      cache: "no-store",
    })
  } catch (e) {
    console.error("ToutiaoHot fetch failed:", e)
    return null
  }
}

type HotItem = {
  url: string
  title: string
  hot_value: string
}

export default async function ToutiaoHot() {
  const res = await ToutiaoHotGTE()

  // ❌ 请求失败
  if (!res || !res.ok) {
    return (
      <div className="border p-2 rounded-2xl text-gray-500">
        今日头条加载失败
      </div>
    )
  }

  let json: any
  try {
    json = await res.json()
  } catch {
    return (
      <div className="border p-2 rounded-2xl text-gray-500">
        数据解析失败
      </div>
    )
  }

  const list: HotItem[] = Array.isArray(json?.data) ? json.data : []

  // ❌ 没有数据
  if (list.length === 0) {
    return (
      <div className="border p-2 rounded-2xl text-gray-500">
        暂无今日头条数据
      </div>
    )
  }

  return (
    <div className="border p-2 rounded-2xl">
      <span className="font-semibold">今日头条</span>

      {list.slice(1, 6).map((item, idx) => (
        <Link
          href={item.url}
          key={idx}
          target="_blank"
          rel="noopener noreferrer"
          className="flex py-1 flex-col justify-start hover:bg-gray-200 cursor-pointer rounded-2xl p-1"
        >
          <span className="line-clamp-2">{item.title}</span>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <ChartNoAxesColumn size={14} />
            <span>{item.hot_value}</span>
          </div>
        </Link>
      ))}

      <Link
        href="/imitation-x/explore"
        className="text-blue-500 block mt-2 hover:underline"
      >
        显示更多
      </Link>
    </div>
  )
}
