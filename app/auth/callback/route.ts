import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeout);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/imitation-x";

  if (!next.startsWith("/")) {
    next = "/imitation-x";
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.user) {
    console.error("Auth error:", error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const user = data.user;

  try {
    await withTimeout(
      prisma.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email ?? "",
          name: user.user_metadata?.full_name ?? null,
          avatar: user.user_metadata?.avatar_url ?? null,
        },
        create: {
          id: user.id,
          email: user.email ?? "",
          name: user.user_metadata?.full_name ?? null,
          avatar: user.user_metadata?.avatar_url ?? null,
        },
      }),
      5000,
    );
  } catch (upsertError) {
    console.error("Failed to sync user into Prisma:", upsertError);
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
