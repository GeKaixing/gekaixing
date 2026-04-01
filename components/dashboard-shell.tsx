import type React from "react";
import { getTranslations } from "next-intl/server";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DASHBOARD_NAV_ITEMS, type DashboardNavKey } from "@/lib/dashboard/navigation";
import { prisma } from "@/lib/prisma";
import { withTimeoutOrNull } from "@/lib/with-timeout";
import { createClient } from "@/utils/supabase/server";

type DashboardShellProps = {
  children: React.ReactNode;
};

const SIDEBAR_STYLE: React.CSSProperties = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as React.CSSProperties;

export default async function DashboardShell({ children }: DashboardShellProps): Promise<React.JSX.Element> {
  const t = await getTranslations("Dashboard.nav");
  const navLabels = DASHBOARD_NAV_ITEMS.reduce<Record<DashboardNavKey, string>>((acc, item) => {
    acc[item.key] = t(item.key);
    return acc;
  }, {} as Record<DashboardNavKey, string>);
  const brandLabel = t("brand");
  const fallbackTitle = t("fallbackTitle");

  let currentUser:
    | {
        name: string;
        email: string;
        avatar: string;
      }
    | undefined;

  try {
    const supabase = await createClient();
    const authResult = await withTimeoutOrNull(supabase.auth.getUser(), 8000);
    const user = authResult?.data.user ?? null;

    if (user?.id) {
      const profile = await withTimeoutOrNull(
        prisma.user.findUnique({
          where: { id: user.id },
          select: {
            name: true,
            avatar: true,
            email: true,
          },
        }),
        8000,
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
      <AppSidebar variant="inset" currentUser={currentUser} labels={navLabels} brandLabel={brandLabel} />
      <SidebarInset>
        <SiteHeader labels={navLabels} fallbackTitle={fallbackTitle} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
