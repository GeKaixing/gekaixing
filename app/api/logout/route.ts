import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("next-auth.session-token", "", {
    expires: new Date(0),
    path: "/",
  });
  response.cookies.set("__Secure-next-auth.session-token", "", {
    expires: new Date(0),
    path: "/",
    secure: true,
  });
  return response;
}
