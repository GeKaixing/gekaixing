import { NextResponse } from "next/server";

import { hashVerificationToken, verifyVerificationToken } from "@/lib/auth/email-verification";
import { prisma } from "@/lib/prisma";

function redirectTo(origin: string, path: string): NextResponse {
  return NextResponse.redirect(`${origin}${path}`);
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";

  if (!token) {
    return redirectTo(url.origin, "/account/login?error=invalid_verify_link");
  }

  const parsed = await verifyVerificationToken(token);
  if (!parsed) {
    return redirectTo(url.origin, "/account/login?error=invalid_verify_link");
  }

  const tokenHash = hashVerificationToken(token);
  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  });
  if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
    return redirectTo(url.origin, "/account/login?error=invalid_verify_link");
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
    select: { id: true },
  });
  if (!user) {
    return redirectTo(url.origin, "/account/login?error=invalid_verify_link");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.emailVerificationToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return redirectTo(url.origin, "/account/login?verified=1");
}
