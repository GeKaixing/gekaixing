import Footer from "@/components/gekaixing/Footer";
import MobileFooter from "@/components/gekaixing/MobileFooter";
import MobileHeader from "@/components/gekaixing/MobileHeader";
import Sidebar from "@/components/gekaixing/Sidebar";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import type { ReactElement, ReactNode } from "react";
import "highlight.js/styles/github-dark.css";

export interface userResult {
  name: string | null;
  id: string;
  userid: string;
  email: string;
  avatar: string | null;
  backgroundImage: string | null;
  briefIntroduction: string | null;
  createdAt: Date;
  isPremium: boolean;
  updatedAt: Date;
  _count: {
    followers: number;
    following: number;
  };
}

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

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactElement> {
  const supabase = await createClient();
  let userId: string | null = null;

  try {
    const {
      data: { user },
    } = await withTimeout(supabase.auth.getUser(), 5000);
    userId = user?.id ?? null;
  } catch (error) {
    console.error("Failed to resolve session user in gekaixing layout:", error);
  }

  let userInfo: userResult | null = null;
  if (userId) {
    try {
      userInfo = await withTimeout(
        prisma.user.findUnique({
          where: {
            id: userId,
          },
          include: {
            _count: {
              select: {
                followers: true,
                following: true,
              },
            },
          },
        }),
        5000,
      );
    } catch (error) {
      console.error("Failed to load profile in gekaixing layout:", error);
    }
  }

  let mentionCount = 0;
  if (userInfo?.id) {
    try {
      mentionCount = await withTimeout(
        prisma.post.count({
          where: {
            authorId: { not: userInfo.id },
            content: { contains: `@${userInfo.userid}`, mode: "insensitive" },
          },
        }),
        5000,
      );
    } catch (error) {
      console.error("Failed to count mentions in gekaixing layout:", error);
    }
  }

  return (
    <div className="min-h-screen">
      <MobileHeader user={userInfo} />
      <div className="flex justify-center w-full mx-auto min-h-screen">
        <header className="hidden sm:flex w-[88px] lg:w-[275px] shrink-0 sticky top-0 h-screen transition-all duration-200">
          <Sidebar user={userInfo} mentionCount={mentionCount} />
        </header>
        <main className="flex-1 w-full max-w-[600px] border-x border-border sm:border-x">{children}</main>
        <footer className="hidden xl:flex w-[350px] shrink-0 pl-8 py-4 sticky top-0 h-screen overflow-y-auto">
          <Footer />
        </footer>
      </div>
      <MobileFooter id={userId ?? undefined} />
    </div>
  );
}
