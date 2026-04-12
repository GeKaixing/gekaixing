import { NextResponse } from "next/server";

import { fetchLegacyNews } from "@/app/api/news/_lib/fetchLegacyNews";

export async function GET() {
  try {
    const data = await fetchLegacyNews("us", 20);
    return NextResponse.json({ data, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch US news", success: false },
      { status: 500 },
    );
  }
}
