import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Password reset email flow is not available in local Auth.js mode",
    },
    { status: 501 },
  );
}
