import { getLocale, getTranslations } from "next-intl/server";

import { JobPostPublisher } from "@/components/dashboard/job-post-publisher";
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
import { getDashboardHireTalentData } from "@/lib/dashboard/service";
import { getDashboardViewer } from "@/lib/dashboard/viewer";
import { TrendPill } from "@/components/dashboard/trend-pill";

function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function HireTalentPage(): Promise<React.JSX.Element> {
  const { userId } = await getDashboardViewer();
  const [t, locale] = await Promise.all([getTranslations("Dashboard.talent"), getLocale()]);
  const { summary, jobPosts } = await getDashboardHireTalentData(userId);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <Card>
          <CardHeader>
            <CardDescription>{t("stats.totalJobPosts")}</CardDescription>
            <CardTitle>{summary.totalJobPosts}</CardTitle>
            <CardAction>
              <TrendPill current={summary.totalJobPosts} previous={summary.remoteJobPosts} />
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("stats.remoteJobPosts")}</CardDescription>
            <CardTitle>{summary.remoteJobPosts}</CardTitle>
            <CardAction>
              <TrendPill current={summary.remoteJobPosts} previous={summary.hybridJobPosts} />
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("stats.hybridJobPosts")}</CardDescription>
            <CardTitle>{summary.hybridJobPosts}</CardTitle>
            <CardAction>
              <TrendPill current={summary.hybridJobPosts} previous={summary.totalJobPosts} />
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("publishTitle")}</CardTitle>
            <CardDescription>{t("publishDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <JobPostPublisher />
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.title")}</TableHead>
                  <TableHead>{t("table.company")}</TableHead>
                  <TableHead>{t("table.locationType")}</TableHead>
                  <TableHead>{t("table.seniority")}</TableHead>
                  <TableHead>{t("table.employmentType")}</TableHead>
                  <TableHead className="text-right">{t("table.time")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobPosts.length ? (
                  jobPosts.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.title}</div>
                        {item.description ? (
                          <div className="mt-1 max-w-[420px] truncate text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell>{item.company}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{t(`locationType.${item.locationType}`)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{t(`seniority.${item.seniority}`)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{t(`employmentType.${item.employmentType}`)}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDate(item.createdAt, locale)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      {t("noData")}
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
