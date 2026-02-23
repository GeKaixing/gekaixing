import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = (searchParams.get("query") || "").trim()

    const users = await prisma.user.findMany({
      where: query
        ? {
            OR: [
              { userid: { contains: query, mode: "insensitive" } },
              { name: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      select: {
        id: true,
        userid: true,
        name: true,
        avatar: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    })

    return NextResponse.json({ data: users, success: true })
  } catch (error) {
    console.error("Search users failed:", error)
    return NextResponse.json({ error: "Search users failed" }, { status: 500 })
  }
}
