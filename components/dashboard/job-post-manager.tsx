"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { DashboardJobPostItem } from "@/lib/dashboard/types";
import {
  EMPLOYMENT_TYPES,
  LOCATION_TYPES,
  SENIORITY_LEVELS,
  type EmploymentType,
  type LocationType,
  type SeniorityLevel,
} from "@/lib/dashboard/job-posting";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type EditFormState = {
  id: string;
  title: string;
  company: string;
  description: string;
  locationType: LocationType;
  seniority: SeniorityLevel;
  employmentType: EmploymentType;
};

function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toEditForm(item: DashboardJobPostItem): EditFormState {
  return {
    id: item.id,
    title: item.title,
    company: item.company,
    description: item.description,
    locationType: item.locationType as LocationType,
    seniority: item.seniority as SeniorityLevel,
    employmentType: item.employmentType as EmploymentType,
  };
}

export function JobPostManager({ initialJobPosts }: { initialJobPosts: DashboardJobPostItem[] }): React.JSX.Element {
  const t = useTranslations("Dashboard.talent");
  const locale = useLocale();
  const router = useRouter();

  const [rows, setRows] = useState<DashboardJobPostItem[]>(initialJobPosts);
  const [editing, setEditing] = useState<EditFormState | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const canUpdate =
    !!editing &&
    editing.title.trim().length > 0 &&
    editing.company.trim().length > 0 &&
    editing.description.trim().length > 0;

  const handleUpdate = async (): Promise<void> => {
    if (!editing || !canUpdate || updating) {
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/dashboard/jobs/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title.trim(),
          company: editing.company.trim(),
          description: editing.description.trim(),
          locationType: editing.locationType,
          seniority: editing.seniority,
          employmentType: editing.employmentType,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        error?: string;
        data?: DashboardJobPostItem;
      };
      if (!response.ok || !payload.success || !payload.data) {
        toast.error(payload.error ?? t("updateFailed"));
        return;
      }

      setRows((prev) =>
        prev.map((item) =>
          item.id === editing.id
            ? {
                ...item,
                title: payload.data!.title,
                company: payload.data!.company,
                description: payload.data!.description,
                locationType: payload.data!.locationType,
                seniority: payload.data!.seniority,
                employmentType: payload.data!.employmentType,
              }
            : item
        )
      );
      toast.success(t("updateSuccess"));
      setEditing(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to update job posting:", error);
      toast.error(t("updateFailed"));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!deletingId || deleting) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/dashboard/jobs/${deletingId}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !payload.success) {
        toast.error(payload.error ?? t("deleteFailed"));
        return;
      }

      setRows((prev) => prev.filter((item) => item.id !== deletingId));
      toast.success(t("deleteSuccess"));
      setDeletingId(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete job posting:", error);
      toast.error(t("deleteFailed"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.title")}</TableHead>
            <TableHead>{t("table.company")}</TableHead>
            <TableHead>{t("table.locationType")}</TableHead>
            <TableHead>{t("table.seniority")}</TableHead>
            <TableHead>{t("table.employmentType")}</TableHead>
            <TableHead>{t("table.actions")}</TableHead>
            <TableHead className="text-right">{t("table.time")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.title}</div>
                  {item.description ? (
                    <div className="mt-1 max-w-[420px] truncate text-xs text-muted-foreground">{item.description}</div>
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
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(toEditForm(item))}
                    >
                      {t("actions.edit")}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingId(item.id)}
                    >
                      {t("actions.delete")}
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{formatDate(item.createdAt, locale)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                {t("noData")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={!!editing} onOpenChange={(open) => (open ? undefined : setEditing(null))}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("editTitle")}</DialogTitle>
            <DialogDescription>{t("editDesc")}</DialogDescription>
          </DialogHeader>

          {editing ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-job-title">{t("form.title")}</Label>
                <Input
                  id="edit-job-title"
                  value={editing.title}
                  onChange={(event) => setEditing({ ...editing, title: event.target.value })}
                  maxLength={100}
                  disabled={updating}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-job-company">{t("form.company")}</Label>
                <Input
                  id="edit-job-company"
                  value={editing.company}
                  onChange={(event) => setEditing({ ...editing, company: event.target.value })}
                  maxLength={100}
                  disabled={updating}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-job-description">{t("form.description")}</Label>
                <textarea
                  id="edit-job-description"
                  value={editing.description}
                  onChange={(event) => setEditing({ ...editing, description: event.target.value })}
                  maxLength={3000}
                  rows={6}
                  disabled={updating}
                  className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
                />
              </div>

              <div className="space-y-2">
                <Label>{t("form.locationType")}</Label>
                <Select
                  value={editing.locationType}
                  onValueChange={(value) => setEditing({ ...editing, locationType: value as LocationType })}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_TYPES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`locationType.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("form.seniority")}</Label>
                <Select
                  value={editing.seniority}
                  onValueChange={(value) => setEditing({ ...editing, seniority: value as SeniorityLevel })}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SENIORITY_LEVELS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`seniority.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("form.employmentType")}</Label>
                <Select
                  value={editing.employmentType}
                  onValueChange={(value) => setEditing({ ...editing, employmentType: value as EmploymentType })}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`employmentType.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditing(null)} disabled={updating}>
              {t("actions.cancel")}
            </Button>
            <Button type="button" onClick={() => void handleUpdate()} disabled={!canUpdate || updating}>
              {updating ? t("actions.saving") : t("actions.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => (open ? undefined : setDeletingId(null))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{t("actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction disabled={deleting} onClick={() => void handleDelete()}>
              {deleting ? t("actions.deleting") : t("actions.confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
