"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"

export default function ShowOnGkx({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isGkxRoute =
    pathname === "/imitation-x/gkx" || pathname.startsWith("/imitation-x/gkx/")

  if (!isGkxRoute) return null

  return <>{children}</>
}
