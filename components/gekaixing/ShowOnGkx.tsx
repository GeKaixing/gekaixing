"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"

export default function ShowOnGkx({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isGkxRoute =
    pathname === "/gekaixing/gkx" || pathname.startsWith("/gekaixing/gkx/")

  if (!isGkxRoute) return null

  return <>{children}</>
}
