"use client";

import { useMemo } from "react";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DASHBOARD_NAV_ITEMS } from "@/lib/dashboard/navigation";

export function SiteHeader(): React.JSX.Element {
  const pathname = usePathname();
  const t = useTranslations("Dashboard.nav");

  const title = useMemo(() => {
    const match = DASHBOARD_NAV_ITEMS.find((item) => item.href === pathname);

    if (!match) {
      return t("fallbackTitle");
    }

    return t(match.key);
  }, [pathname, t]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2" />
      </div>
    </header>
  );
}
