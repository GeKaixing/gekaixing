import { getLocale, getTranslations } from "next-intl/server";

import { DashboardEngagementPanel } from "@/components/dashboard/dashboard-engagement-panel";
import { TrendPill } from "@/components/dashboard/trend-pill";
import { DashboardTrendChart } from "@/components/dashboard/dashboard-trend-chart";
import { Badge } from "@/components/ui/badge";
import {
  CardAction,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDashboardHomeData } from "@/lib/dashboard/service";
import { getDashboardViewer } from "@/lib/dashboard/viewer";

function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const locale = await getLocale();
  const { userId } = await getDashboardViewer();

  const [t, tc, te] = await Promise.all([
    getTranslations("Dashboard.home"),
    getTranslations("Dashboard.common"),
    getTranslations("Dashboard.engagement"),
  ]);
  const { summary, trend, recentPosts } = await getDashboardHomeData(userId);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 xl:grid-cols-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardDescription>{t("stats.totalUsers")}</CardDescription>
            <CardTitle>{summary.totalUsers}</CardTitle>
            <CardAction>
              <TrendPill current={summary.totalUsers} previous={summary.totalPremiumUsers} />
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("stats.premiumUsers")}</CardDescription>
            <CardTitle>{summary.totalPremiumUsers}</CardTitle>
            <CardAction>
              <TrendPill current={summary.totalPremiumUsers} previous={summary.totalUsers} />
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("stats.postsReplies")}</CardDescription>
            <CardTitle>
              {summary.totalPosts} / {summary.totalReplies}
            </CardTitle>
            <CardAction>
              <TrendPill current={summary.totalPosts} previous={summary.totalReplies} />
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("stats.weeklyAdded")}</CardDescription>
            <CardTitle>
              {summary.weeklyNewUsers} / {summary.weeklyNewPosts}
            </CardTitle>
            <CardAction>
              <TrendPill current={summary.weeklyNewUsers} previous={summary.weeklyNewPosts} />
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <DashboardEngagementPanel
          trend={trend}
          locale={locale}
          labels={{
            title: te("title"),
            impressions: te("impressions"),
            engagementRate: te("engagementRate"),
            replies: te("replies"),
            posts: te("posts"),
            growth: te("growth"),
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
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
            <CardTitle>{t("recentTitle")}</CardTitle>
            <CardDescription>{t("recentDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.author")}</TableHead>
                  <TableHead>{t("table.content")}</TableHead>
                  <TableHead>{t("table.engagement")}</TableHead>
                  <TableHead className="text-right">{t("table.time")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPosts.length ? (
                  recentPosts.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.author.name ?? tc("anonymousUser")}</div>
                        <div className="text-xs text-muted-foreground">@{item.author.userid}</div>
                      </TableCell>
                      <TableCell className="max-w-[320px]">
                        <div
                          className="whitespace-pre-wrap break-words"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Badge variant="outline">{t("badge.likes", { count: item.likeCount })}</Badge>
                          <Badge variant="outline">{t("badge.replies", { count: item.replyCount })}</Badge>
                          <Badge variant="outline">{t("badge.shares", { count: item.shareCount })}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatDate(item.createdAt, locale)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      {t("noPosts")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
