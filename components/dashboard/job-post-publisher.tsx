"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EMPLOYMENT_TYPES, LOCATION_TYPES, SENIORITY_LEVELS, type EmploymentType, type LocationType, type SeniorityLevel } from "@/lib/dashboard/job-posting";

export function JobPostPublisher(): React.JSX.Element {
  const t = useTranslations("Dashboard.talent");
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [locationType, setLocationType] = useState<LocationType | "">("");
  const [seniority, setSeniority] = useState<SeniorityLevel | "">("");
  const [employmentType, setEmploymentType] = useState<EmploymentType | "">("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const canSubmit = title.trim() && company.trim() && description.trim() && locationType && seniority && employmentType;

  const submit = async (): Promise<void> => {
    if (!canSubmit || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/dashboard/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          company: company.trim(),
          description: description.trim(),
          locationType,
          seniority,
          employmentType,
        }),
      });

      const payload = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !payload.success) {
        toast.error(payload.error ?? t("createFailed"));
        return;
      }

      toast.success(t("createSuccess"));
      setTitle("");
      setCompany("");
      setDescription("");
      setLocationType("");
      setSeniority("");
      setEmploymentType("");
      router.refresh();
    } catch (error) {
      console.error("Failed to create dashboard job posting:", error);
      toast.error(t("createFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="job-title">{t("form.title")}</Label>
        <Input
          id="job-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t("form.titlePlaceholder")}
          maxLength={100}
          disabled={submitting}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="job-company">{t("form.company")}</Label>
        <Input
          id="job-company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder={t("form.companyPlaceholder")}
          maxLength={100}
          disabled={submitting}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="job-description">{t("form.description")}</Label>
        <textarea
          id="job-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t("form.descriptionPlaceholder")}
          maxLength={3000}
          disabled={submitting}
          rows={6}
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
        />
      </div>

      <div className="space-y-2">
        <Label>{t("form.locationType")}</Label>
        <Select value={locationType} onValueChange={(value) => setLocationType(value as LocationType)} disabled={submitting}>
          <SelectTrigger>
            <SelectValue placeholder={t("form.locationTypePlaceholder")} />
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
        <Select value={seniority} onValueChange={(value) => setSeniority(value as SeniorityLevel)} disabled={submitting}>
          <SelectTrigger>
            <SelectValue placeholder={t("form.seniorityPlaceholder")} />
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
          value={employmentType}
          onValueChange={(value) => setEmploymentType(value as EmploymentType)}
          disabled={submitting}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("form.employmentTypePlaceholder")} />
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

      <div className="flex items-end md:col-span-2">
        <Button onClick={() => void submit()} disabled={!canSubmit || submitting}>
          {submitting ? t("form.submitting") : t("form.submit")}
        </Button>
      </div>
    </div>
  );
}
