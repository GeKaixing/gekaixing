import { getTranslations } from "next-intl/server";

import { DashboardActionChart } from "@/components/dashboard/dashboard-action-chart";
import { DashboardTrendChart } from "@/components/dashboard/dashboard-trend-chart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardRadarData } from "@/lib/dashboard/service";
import { getDashboardViewer } from "@/lib/dashboard/viewer";

export default async function RadarIntelligencePage(): Promise<React.JSX.Element> {
  const { userId } = await getDashboardViewer();
  const t = await getTranslations("Dashboard.radar");
  const { actionSummary, trend } = await getDashboardRadarData(userId);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("actionTitle")}</CardTitle>
          <CardDescription>{t("actionDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {actionSummary.length ? (
            <>
              <DashboardActionChart data={actionSummary} />
              <div className="grid grid-cols-1 gap-2">
                {actionSummary.slice(0, 4).map((item) => (
                  <div key={item.actionType} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span className="text-sm">{item.actionType}</span>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">{t("noActions")}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("trendTitle")}</CardTitle>
          <CardDescription>{t("trendDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {trend.length ? (
            <DashboardTrendChart data={trend} />
          ) : (
            <div className="text-sm text-muted-foreground">{t("noTrend")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
