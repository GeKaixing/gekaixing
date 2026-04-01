import type React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

type DashboardShellProps = {
  children: React.ReactNode;
};

const SIDEBAR_STYLE: React.CSSProperties = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as React.CSSProperties;

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

export default async function DashboardShell({ children }: DashboardShellProps): Promise<React.JSX.Element> {
  let currentUser:
    | {
        name: string;
        email: string;
        avatar: string;
      }
    | undefined;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await withTimeout(supabase.auth.getUser(), 5000);

    if (user?.id) {
      const profile = await withTimeout(
        prisma.user.findUnique({
          where: { id: user.id },
          select: {
            name: true,
            avatar: true,
            email: true,
          },
        }),
        5000,
      );

      currentUser = {
        name: profile?.name ?? user.user_metadata?.name ?? "User",
        email: profile?.email ?? user.email ?? "",
        avatar: profile?.avatar ?? user.user_metadata?.avatar_url ?? "/avatars/shadcn.jpg",
      };
    }
  } catch (error) {
    console.error("Failed to resolve dashboard session user:", error);
  }

  return (
    <SidebarProvider style={SIDEBAR_STYLE} className="dashboard-mono">
      <AppSidebar variant="inset" currentUser={currentUser} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
