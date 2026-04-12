import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = "/account";
  redirectTo.search = "";
  redirectTo.searchParams.set("error", "email_confirm_not_configured");
  return NextResponse.redirect(redirectTo);
}
