import { NextResponse } from "next/server"

export async function GET() {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3000)

  try {
    const res = await fetch("https://dabenshi.cn/other/api/hot.php?type=toutiaoHot", {
      method: "GET",
      signal: controller.signal,
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      return NextResponse.json({ data: [] }, { status: 200 })
    }

    const json = await res.json()
    const data = Array.isArray(json?.data) ? json.data : []
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error("toutiao hot api failed:", error)
    return NextResponse.json({ data: [] }, { status: 200 })
  } finally {
    clearTimeout(timeoutId)
  }
}
