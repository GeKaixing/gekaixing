import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { createVerificationToken, hashVerificationToken } from "@/lib/auth/email-verification";
import { sendVerificationEmail } from "@/lib/auth/mailer";
import { prisma } from "@/lib/prisma";

interface SignupBody {
  email: string;
  password: string;
  name?: string | null;
  avatar?: string | null;
}

function getBaseUrl(): string {
  return (
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_URL ??
    "http://localhost:3000"
  );
}

function buildVerifyLink(baseUrl: string, token: string): string {
  const normalized = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalized}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupBody;
    const email = body.email?.trim().toLowerCase();
    const { password, name, avatar } = body;

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerifiedAt: true },
    });

    const passwordHash = await hash(password, 12);

    if (existingUser?.emailVerifiedAt) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 },
      );
    }

    if (existingUser && !existingUser.emailVerifiedAt) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          passwordHash,
          name: name ?? "anonymity",
          avatar: avatar ?? null,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          email,
          passwordHash,
          userid: `user_${crypto.randomUUID().slice(0, 8)}`,
          name: name ?? "anonymity",
          avatar: avatar ?? null,
          emailVerifiedAt: null,
        },
      });
    }

    await prisma.emailVerificationToken.deleteMany({
      where: {
        email,
        usedAt: null,
      },
    });

    const { token, expiresAt } = await createVerificationToken(email);
    const tokenHash = hashVerificationToken(token);
    await prisma.emailVerificationToken.create({
      data: {
        email,
        tokenHash,
        expiresAt,
      },
    });

    const verifyLink = buildVerifyLink(getBaseUrl(), token);
    await sendVerificationEmail({ to: email, verifyLink });

    return NextResponse.json({ success: true, verificationSent: true });
  } catch (error) {
    console.error("Signup failed:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
