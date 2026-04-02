import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { DashboardDauChart } from "@/components/dashboard/dashboard-dau-chart";
import { Button } from "@/components/ui/button";
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

function formatRate(value: number): string {
  return `${value.toFixed(2)}%`;
}

function getHeatmapClass(value: number): string {
  if (value >= 50) {
    return "bg-emerald-600/90 text-white";
  }
  if (value >= 35) {
    return "bg-emerald-500/70 text-emerald-950";
  }
  if (value >= 20) {
    return "bg-amber-400/70 text-amber-950";
  }
  if (value > 0) {
    return "bg-rose-300/70 text-rose-950";
  }
  return "bg-muted text-muted-foreground";
}

type VipSupportPageSearchParams = {
  metricMode?: string | string[];
  retentionMode?: string | string[];
};

export default async function VipSupportPage({
  searchParams,
}: {
  searchParams: Promise<VipSupportPageSearchParams>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  const selectedModeRaw = Array.isArray(params.metricMode) ? params.metricMode[0] : params.metricMode;
  const selectedMode = selectedModeRaw === "pv" ? "pv" : "uv";
  const uvMode = selectedMode === "uv";
  const selectedRetentionModeRaw = Array.isArray(params.retentionMode) ? params.retentionMode[0] : params.retentionMode;
  const retentionMode = selectedRetentionModeRaw === "week" ? "week" : "day";
  const { userId } = await getDashboardViewer();

  const [t, tc, te] = await Promise.all([
    getTranslations("Dashboard.home"),
    getTranslations("Dashboard.common"),
    getTranslations("Dashboard.engagement"),
  ]);

  const {
    coreMetrics,
    dauTrend,
    retentionCohorts,
    retentionWeeklyCohorts,
    trafficSources,
    funnel,
    audienceSegments,
    contentSegments,
  } = await getDashboardHomeData(userId);
  const displayedRetentionCohorts = retentionMode === "week" ? retentionWeeklyCohorts : retentionCohorts;

  const formatMetricPair = (uvValue: number, uvBase: number, pvValue: number, pvBase: number): string => {
    return uvMode ? `UV ${uvValue}/${uvBase}` : `PV ${pvValue}/${pvBase}`;
  };

  const translateWithFallback = (key: string, fallback: string): string => {
    try {
      return t(key as never);
    } catch {
      return fallback;
    }
  };

  const resolveSourceLabel = (source: string): string => translateWithFallback(`segmentation.source.${source}`, source);
  const resolveFunnelLabel = (step: string): string => translateWithFallback(`segmentation.funnel.${step}`, step);
  const resolveAudienceLabel = (segment: string): string => translateWithFallback(`segmentation.audience.${segment}`, segment);
  const resolveContentLabel = (segment: string): string => translateWithFallback(`segmentation.content.${segment}`, segment);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <Card>
          <CardHeader>
            <CardDescription>{t("earlyStage.activeTitle")}</CardDescription>
            <CardTitle>
              DAU {coreMetrics.dau} / WAU {coreMetrics.wau} / MAU {coreMetrics.mau}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t("earlyStage.newUsersToday", { count: coreMetrics.newUsersToday })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("earlyStage.retentionTitle")}</CardDescription>
            <CardTitle>
              D1 {formatRate(coreMetrics.d1Retention)} / D7 {formatRate(coreMetrics.d7Retention)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{t("earlyStage.retentionDesc")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("earlyStage.interactionTitle")}</CardDescription>
            <CardTitle>{coreMetrics.avgInteractionsPerActiveUser7d.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t("earlyStage.interactionDesc", {
              interactions: coreMetrics.interactions7d,
              users: coreMetrics.activeUsers7d,
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("earlyStage.dauTrendTitle")}</CardTitle>
            <CardDescription>{t("earlyStage.dauTrendDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {dauTrend.length ? <DashboardDauChart data={dauTrend} /> : <div className="text-sm text-muted-foreground">{tc("noData")}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("earlyStage.retentionHeatmapTitle")}</CardTitle>
            <CardDescription>{t("earlyStage.retentionHeatmapDesc")}</CardDescription>
            <CardAction>
              <div className="inline-flex items-center gap-1 rounded-md border p-1">
                <Button asChild size="sm" variant={retentionMode === "day" ? "default" : "outline"}>
                  <Link href={`/dashboard/vip-support?metricMode=${selectedMode}&retentionMode=day`}>{t("earlyStage.dayCohort")}</Link>
                </Button>
                <Button asChild size="sm" variant={retentionMode === "week" ? "default" : "outline"}>
                  <Link href={`/dashboard/vip-support?metricMode=${selectedMode}&retentionMode=week`}>{t("earlyStage.weekCohort")}</Link>
                </Button>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{retentionMode === "week" ? t("earlyStage.cohortWeek") : t("earlyStage.cohortDate")}</TableHead>
                  <TableHead>{t("earlyStage.cohortUsers")}</TableHead>
                  <TableHead>D1</TableHead>
                  <TableHead>D7</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedRetentionCohorts.length ? (
                  displayedRetentionCohorts.map((item) => (
                    <TableRow key={item.cohortDate}>
                      <TableCell>{item.cohortDate}</TableCell>
                      <TableCell>{item.users}</TableCell>
                      <TableCell>
                        <span className={`inline-flex min-w-14 justify-center rounded px-2 py-1 text-xs ${getHeatmapClass(item.d1Retention)}`}>
                          {formatRate(item.d1Retention)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex min-w-14 justify-center rounded px-2 py-1 text-xs ${getHeatmapClass(item.d7Retention)}`}>
                          {formatRate(item.d7Retention)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      {tc("noData")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end px-4 lg:px-6">
        <div className="inline-flex items-center gap-2 rounded-md border p-1">
          <Button asChild size="sm" variant={uvMode ? "default" : "outline"}>
            <Link href={`/dashboard/vip-support?metricMode=uv&retentionMode=${retentionMode}`}>UV</Link>
          </Button>
          <Button asChild size="sm" variant={uvMode ? "outline" : "default"}>
            <Link href={`/dashboard/vip-support?metricMode=pv&retentionMode=${retentionMode}`}>PV</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("segmentation.trafficTitle")}</CardTitle>
            <CardDescription>{t("segmentation.trafficDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("segmentation.cols.segment")}</TableHead>
                  <TableHead>{te("impressions")}</TableHead>
                  <TableHead>{te("postClickRate")}</TableHead>
                  <TableHead>{te("replyRate")}</TableHead>
                  <TableHead>{te("profileEnterRate")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trafficSources.length ? (
                  trafficSources.map((item) => (
                    <TableRow key={item.source}>
                      <TableCell>{resolveSourceLabel(item.source)}</TableCell>
                      <TableCell>{formatMetricPair(item.impressions, item.impressions, item.impressionsPv, item.impressionsPv)}</TableCell>
                      <TableCell>{formatMetricPair(item.postClicks, item.impressions, item.postClicksPv, item.impressionsPv)}</TableCell>
                      <TableCell>{formatMetricPair(item.repliesReceived, item.impressions, item.repliesReceivedPv, item.impressionsPv)}</TableCell>
                      <TableCell>{formatMetricPair(item.profileEnters, item.impressions, item.profileEntersPv, item.impressionsPv)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      {tc("noData")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("segmentation.funnelTitle")}</CardTitle>
            <CardDescription>{t("segmentation.funnelDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("segmentation.cols.segment")}</TableHead>
                  <TableHead>{t("segmentation.cols.users")}</TableHead>
                  <TableHead>{t("segmentation.cols.events")}</TableHead>
                  <TableHead>{t("segmentation.cols.conversion")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funnel.length ? (
                  funnel.map((item) => (
                    <TableRow key={item.step}>
                      <TableCell>{resolveFunnelLabel(item.step)}</TableCell>
                      <TableCell>{item.users}</TableCell>
                      <TableCell>{item.events}</TableCell>
                      <TableCell>{formatRate(item.conversionFromPrev)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      {tc("noData")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("segmentation.audienceTitle")}</CardTitle>
            <CardDescription>{t("segmentation.audienceDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("segmentation.cols.segment")}</TableHead>
                  <TableHead>{t("segmentation.cols.users")}</TableHead>
                  <TableHead>{te("impressions")}</TableHead>
                  <TableHead>{te("postClickRate")}</TableHead>
                  <TableHead>{te("replyRate")}</TableHead>
                  <TableHead>{te("profileEnterRate")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audienceSegments.length ? (
                  audienceSegments.map((item) => (
                    <TableRow key={item.segment}>
                      <TableCell>{resolveAudienceLabel(item.segment)}</TableCell>
                      <TableCell>{item.users}</TableCell>
                      <TableCell>{formatMetricPair(item.impressions, item.impressions, item.impressionsPv, item.impressionsPv)}</TableCell>
                      <TableCell>{formatMetricPair(item.postClicks, item.impressions, item.postClicksPv, item.impressionsPv)}</TableCell>
                      <TableCell>{formatMetricPair(item.repliesReceived, item.impressions, item.repliesReceivedPv, item.impressionsPv)}</TableCell>
                      <TableCell>{formatMetricPair(item.profileEnters, item.impressions, item.profileEntersPv, item.impressionsPv)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      {tc("noData")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("segmentation.contentTitle")}</CardTitle>
            <CardDescription>{t("segmentation.contentDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("segmentation.cols.segment")}</TableHead>
                  <TableHead>{t("segmentation.cols.posts")}</TableHead>
                  <TableHead>{te("postClickRate")}</TableHead>
                  <TableHead>{te("replyRate")}</TableHead>
                  <TableHead>{te("profileEnterRate")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentSegments.length ? (
                  contentSegments.map((item) => (
                    <TableRow key={item.segment}>
                      <TableCell>{resolveContentLabel(item.segment)}</TableCell>
                      <TableCell>{item.posts}</TableCell>
                      <TableCell>{formatRate(item.postClickRate)}</TableCell>
                      <TableCell>{formatRate(item.replyRate)}</TableCell>
                      <TableCell>{formatRate(item.profileEnterRate)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      {tc("noData")}
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
