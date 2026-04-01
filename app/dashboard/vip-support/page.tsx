import { getTranslations } from "next-intl/server";

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
import { getDashboardSupportData } from "@/lib/dashboard/service";
import { getDashboardViewer } from "@/lib/dashboard/viewer";
import { TrendPill } from "@/components/dashboard/trend-pill";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function VipSupportPage(): Promise<React.JSX.Element> {
  const { userId } = await getDashboardViewer();
  const t = await getTranslations("Dashboard.support");
  const { summary, conversations } = await getDashboardSupportData(userId);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <Card>
          <CardHeader>
            <CardDescription>{t("stats.totalConversations")}</CardDescription>
            <CardTitle>{summary.totalConversations}</CardTitle>
            <CardAction>
              <TrendPill current={summary.totalConversations} previous={summary.conversationsWithRecentActivity} />
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("stats.active48h")}</CardDescription>
            <CardTitle>{summary.conversationsWithRecentActivity}</CardTitle>
            <CardAction>
              <TrendPill current={summary.conversationsWithRecentActivity} previous={summary.totalConversations} />
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("stats.stalled")}</CardDescription>
            <CardTitle>{summary.stalledConversations}</CardTitle>
            <CardAction>
              <TrendPill current={summary.stalledConversations} previous={summary.totalConversations} inverse />
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
                  <TableHead>{t("table.conversation")}</TableHead>
                  <TableHead>{t("table.participants")}</TableHead>
                  <TableHead>{t("table.messages")}</TableHead>
                  <TableHead className="text-right">{t("table.updatedAt")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversations.length ? (
                  conversations.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.name ?? `#${item.id.slice(0, 8)}`}</div>
                        <div className="text-xs text-muted-foreground">{item.isGroup ? t("group") : t("direct")}</div>
                      </TableCell>
                      <TableCell>
                        {item.participants.length
                          ? item.participants.map((participant) => participant.name ?? participant.userid).join(" / ")
                          : t("noParticipants")}
                      </TableCell>
                      <TableCell>{item.messageCount}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatDate(item.updatedAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
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
