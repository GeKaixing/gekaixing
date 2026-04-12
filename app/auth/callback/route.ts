import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/account?error=oauth_not_configured`);
}
