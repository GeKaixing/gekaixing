"use client";

import Link from "next/link";
import { Building2, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type JobLocationType = "onsite" | "remote" | "hybrid";
type JobSeniority =
  | "intern"
  | "entry"
  | "junior"
  | "mid"
  | "senior"
  | "lead"
  | "manager"
  | "executive";
type JobEmploymentType = "full-time" | "full-time-contract" | "part-time" | "contract";

type SelectOption<T extends string> = {
  value: T;
  label: string;
};

function getSingleValue(params: URLSearchParams, key: string): string {
  return params.get(key) ?? "";
}

export default function JobsFooterFilters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("ImitationX.Jobs");

  if (pathname !== "/gekaixing/jobs") {
    return null;
  }

  const locationTypeOptions: SelectOption<JobLocationType>[] = [
    { value: "onsite", label: t("locationTypes.onsite") },
    { value: "remote", label: t("locationTypes.remote") },
    { value: "hybrid", label: t("locationTypes.hybrid") },
  ];

  const seniorityOptions: SelectOption<JobSeniority>[] = [
    { value: "intern", label: t("seniority.intern") },
    { value: "entry", label: t("seniority.entry") },
    { value: "junior", label: t("seniority.junior") },
    { value: "mid", label: t("seniority.mid") },
    { value: "senior", label: t("seniority.senior") },
    { value: "lead", label: t("seniority.lead") },
    { value: "manager", label: t("seniority.manager") },
    { value: "executive", label: t("seniority.executive") },
  ];

  const employmentTypeOptions: SelectOption<JobEmploymentType>[] = [
    { value: "full-time", label: t("employmentTypes.fullTime") },
    { value: "full-time-contract", label: t("employmentTypes.fullTimeContract") },
    { value: "part-time", label: t("employmentTypes.partTime") },
    { value: "contract", label: t("employmentTypes.contract") },
  ];

  const keyword = getSingleValue(searchParams, "keyword");
  const location = getSingleValue(searchParams, "location");
  const company = getSingleValue(searchParams, "company");
  const selectedLocationType = getSingleValue(searchParams, "locationType");
  const selectedSeniority = getSingleValue(searchParams, "seniority");
  const selectedEmploymentType = getSingleValue(searchParams, "employmentType");

  return (
    <div className="rounded-3xl border border-border/70 bg-background p-4 shadow-sm sm:p-5">
      <form className="space-y-5" action="/gekaixing/jobs" method="get">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <SlidersHorizontal className="size-4" />
          <span>{t("filters.title")}</span>
        </div>

        <div className="space-y-3">
          <label className="space-y-2 text-sm font-medium text-foreground" htmlFor="footer-keyword">
            <span>{t("filters.keyword")}</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="footer-keyword"
                name="keyword"
                defaultValue={keyword}
                className="pl-9"
                placeholder={t("placeholders.keyword")}
              />
            </div>
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground" htmlFor="footer-location">
            <span>{t("filters.location")}</span>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="footer-location"
                name="location"
                defaultValue={location}
                className="pl-9"
                placeholder={t("placeholders.location")}
              />
            </div>
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground" htmlFor="footer-company">
            <span>{t("filters.company")}</span>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="footer-company"
                name="company"
                defaultValue={company}
                className="pl-9"
                placeholder={t("placeholders.company")}
              />
            </div>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField
            id="footer-location-type"
            title={t("filters.locationType")}
            name="locationType"
            options={locationTypeOptions}
            selectedValue={selectedLocationType}
            allLabel={t("filters.any")}
          />
          <SelectField
            id="footer-seniority"
            title={t("filters.seniority")}
            name="seniority"
            options={seniorityOptions}
            selectedValue={selectedSeniority}
            allLabel={t("filters.any")}
          />
          <SelectField
            id="footer-employment-type"
            title={t("filters.employmentType")}
            name="employmentType"
            options={employmentTypeOptions}
            selectedValue={selectedEmploymentType}
            allLabel={t("filters.any")}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1 rounded-full bg-[#1D9BF0] text-white hover:bg-[#1a8cd8]">
            {t("actions.search")}
          </Button>
          <Button type="button" variant="outline" className="rounded-full" asChild>
            <Link href="/gekaixing/jobs">{t("actions.reset")}</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

function SelectField<T extends string>({
  id,
  title,
  name,
  options,
  selectedValue,
  allLabel,
}: {
  id: string;
  title: string;
  name: string;
  options: SelectOption<T>[];
  selectedValue: string;
  allLabel: string;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-foreground" htmlFor={id}>
      <span>{title}</span>
      <select
        id={id}
        name={name}
        defaultValue={selectedValue}
        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
