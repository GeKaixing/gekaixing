import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { RadarAiAssistant } from "@/components/dashboard/radar-ai-assistant";
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

function toPlainText(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function RadarIntelligencePage(): Promise<React.JSX.Element> {
  const { userId } = await getDashboardViewer();
  const t = await getTranslations("Dashboard.radar");
  const { actionSummary, trend, hotPosts } = await getDashboardRadarData(userId);

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

      <Card>
        <CardHeader>
          <CardTitle>{t("hotPostsTitle")}</CardTitle>
          <CardDescription>{t("hotPostsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {hotPosts.length ? (
            hotPosts.map((post) => (
              <Link
                key={post.id}
                href={`/gekaixing/status/${post.id}`}
                className="block rounded-md border p-3 transition-colors hover:bg-muted/40"
              >
                <div className="line-clamp-2 text-sm">{toPlainText(post.content)}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">{t("likes", { count: post.likeCount })}</Badge>
                  <Badge variant="outline">{t("replies", { count: post.replyCount })}</Badge>
                  <Badge variant="outline">{t("shares", { count: post.shareCount })}</Badge>
                  <Badge>{t("hotScore", { score: post.hotScore })}</Badge>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">{t("noHotPosts")}</div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{t("aiTitle")}</CardTitle>
          <CardDescription>{t("aiCardDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadarAiAssistant />
        </CardContent>
      </Card>
    </div>
  );
}
