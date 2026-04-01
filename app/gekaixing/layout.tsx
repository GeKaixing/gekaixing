import Footer from "@/components/gekaixing/Footer";
import MobileFooter from "@/components/gekaixing/MobileFooter";
import MobileHeader from "@/components/gekaixing/MobileHeader";
import Sidebar from "@/components/gekaixing/Sidebar";
import { prisma } from "@/lib/prisma";
import { withTimeoutOrNull } from "@/lib/with-timeout";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
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

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactElement> {
  const mobileT = await getTranslations("ImitationX.Mobile");
  const supabase = await createClient();
  let userId: string | null = null;

  try {
    const authResult = await withTimeoutOrNull(supabase.auth.getUser(), 8000);
    const user = authResult?.data.user ?? null;
    userId = user?.id ?? null;
  } catch {
    userId = null;
  }

  let userInfo: userResult | null = null;
  if (userId) {
    try {
      userInfo = await withTimeoutOrNull(
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
        8000
      );
    } catch {
      userInfo = null;
    }
  }

  let mentionCount = 0;
  if (userInfo?.id) {
    try {
      const mentionResult = await withTimeoutOrNull(
        prisma.post.count({
          where: {
            authorId: { not: userInfo.id },
            content: { contains: `@${userInfo.userid}`, mode: "insensitive" },
          },
        }),
        8000
      );
      mentionCount = mentionResult ?? 0;
    } catch {
      mentionCount = 0;
    }
  }

  return (
    <div className="min-h-screen">
      <MobileHeader
        user={userInfo}
        labels={{
          home: mobileT("home"),
          search: mobileT("search"),
          settings: mobileT("settings"),
          login: mobileT("login"),
          publish: mobileT("publish"),
        }}
      />
      <div className="flex justify-center w-full mx-auto min-h-screen">
        <header className="hidden sm:flex w-[88px] lg:w-[275px] shrink-0 sticky top-0 h-screen transition-all duration-200">
          <Sidebar user={userInfo} mentionCount={mentionCount} />
        </header>
        <main className="flex-1 w-full max-w-[600px] border-x border-border sm:border-x">{children}</main>
        <footer className="hidden xl:flex w-[350px] shrink-0 pl-8 py-4 sticky top-0 h-screen overflow-y-auto">
          <Footer />
        </footer>
      </div>
      <MobileFooter
        id={userId ?? undefined}
        labels={{
          home: mobileT("home"),
          search: mobileT("search"),
          mine: mobileT("mine"),
        }}
      />
    </div>
  );
}
