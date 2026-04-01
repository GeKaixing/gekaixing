import { getTranslations } from "next-intl/server";

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

export default async function HireTalentPage(): Promise<React.JSX.Element> {
  const { userId } = await getDashboardViewer();
  const [t, tc] = await Promise.all([
    getTranslations("Dashboard.talent"),
    getTranslations("Dashboard.common"),
  ]);
  const { summary, talents } = await getDashboardHireTalentData(userId);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <Card>
          <CardHeader>
            <CardDescription>{t("stats.candidates")}</CardDescription>
            <CardTitle>{summary.activeCreators}</CardTitle>
            <CardAction>
              <TrendPill current={summary.activeCreators} previous={summary.highSignalCreators} />
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("stats.highSignal")}</CardDescription>
            <CardTitle>{summary.highSignalCreators}</CardTitle>
            <CardAction>
              <TrendPill current={summary.highSignalCreators} previous={summary.activeCreators} />
            </CardAction>
          </CardHeader>
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
                  <TableHead>{t("table.user")}</TableHead>
                  <TableHead>{t("table.posts")}</TableHead>
                  <TableHead>{t("table.replies")}</TableHead>
                  <TableHead>{t("table.likes")}</TableHead>
                  <TableHead>{t("table.shares")}</TableHead>
                  <TableHead className="text-right">{t("table.score")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {talents.length ? (
                  talents.map((item) => (
                    <TableRow key={item.authorId}>
                      <TableCell>
                        <div className="font-medium">{item.name ?? tc("anonymousUser")}</div>
                        <div className="text-xs text-muted-foreground">@{item.userid}</div>
                      </TableCell>
                      <TableCell>{item.postCount}</TableCell>
                      <TableCell>{item.replyCount}</TableCell>
                      <TableCell>{item.likeCount}</TableCell>
                      <TableCell>{item.shareCount}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{item.score}</Badge>
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
