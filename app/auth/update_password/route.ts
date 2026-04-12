import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = "/account/update_password";
  redirectTo.search = "";
  return NextResponse.redirect(redirectTo);
}
