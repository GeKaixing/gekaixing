import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";
import { Prisma } from "@/generated/prisma/client";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type DbJobLocationType = "ONSITE" | "REMOTE" | "HYBRID";
type DbJobSeniority = "INTERN" | "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "MANAGER" | "EXECUTIVE";
type DbJobEmploymentType = "FULL_TIME" | "FULL_TIME_CONTRACT" | "PART_TIME" | "CONTRACT";

type JobRow = {
  id: string;
  title: string;
  company: string;
  description: string;
  locationType: string;
  seniority: string;
  employmentType: string;
  createdAt: Date;
  author: {
    id: string;
    userid: string;
    name: string | null;
  };
};

const LOCATION_TO_DB: Record<JobLocationType, DbJobLocationType> = {
  onsite: "ONSITE",
  remote: "REMOTE",
  hybrid: "HYBRID",
};

const DB_TO_LOCATION: Record<DbJobLocationType, JobLocationType> = {
  ONSITE: "onsite",
  REMOTE: "remote",
  HYBRID: "hybrid",
};

const SENIORITY_TO_DB: Record<JobSeniority, DbJobSeniority> = {
  intern: "INTERN",
  entry: "ENTRY",
  junior: "JUNIOR",
  mid: "MID",
  senior: "SENIOR",
  lead: "LEAD",
  manager: "MANAGER",
  executive: "EXECUTIVE",
};

const DB_TO_SENIORITY: Record<DbJobSeniority, JobSeniority> = {
  INTERN: "intern",
  ENTRY: "entry",
  JUNIOR: "junior",
  MID: "mid",
  SENIOR: "senior",
  LEAD: "lead",
  MANAGER: "manager",
  EXECUTIVE: "executive",
};

const EMPLOYMENT_TO_DB: Record<JobEmploymentType, DbJobEmploymentType> = {
  "full-time": "FULL_TIME",
  "full-time-contract": "FULL_TIME_CONTRACT",
  "part-time": "PART_TIME",
  contract: "CONTRACT",
};

const DB_TO_EMPLOYMENT: Record<DbJobEmploymentType, JobEmploymentType> = {
  FULL_TIME: "full-time",
  FULL_TIME_CONTRACT: "full-time-contract",
  PART_TIME: "part-time",
  CONTRACT: "contract",
};

const JOB_LOCATION_VALUES: JobLocationType[] = ["onsite", "remote", "hybrid"];
const JOB_SENIORITY_VALUES: JobSeniority[] = ["intern", "entry", "junior", "mid", "senior", "lead", "manager", "executive"];
const JOB_EMPLOYMENT_VALUES: JobEmploymentType[] = ["full-time", "full-time-contract", "part-time", "contract"];

function getSingleValue(value: string | string[] | undefined): string {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return "";
}

function cleanSearchValue(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, 100);
}

function isJobLocationType(value: string): value is JobLocationType {
  return JOB_LOCATION_VALUES.includes(value as JobLocationType);
}

function isJobSeniority(value: string): value is JobSeniority {
  return JOB_SENIORITY_VALUES.includes(value as JobSeniority);
}

function isJobEmploymentType(value: string): value is JobEmploymentType {
  return JOB_EMPLOYMENT_VALUES.includes(value as JobEmploymentType);
}

function toDbLocationType(value: string): DbJobLocationType {
  if (value === "ONSITE" || value === "REMOTE" || value === "HYBRID") {
    return value;
  }
  return "ONSITE";
}

function toDbSeniority(value: string): DbJobSeniority {
  if (
    value === "INTERN" ||
    value === "ENTRY" ||
    value === "JUNIOR" ||
    value === "MID" ||
    value === "SENIOR" ||
    value === "LEAD" ||
    value === "MANAGER" ||
    value === "EXECUTIVE"
  ) {
    return value;
  }
  return "ENTRY";
}

function toDbEmploymentType(value: string): DbJobEmploymentType {
  if (value === "FULL_TIME" || value === "FULL_TIME_CONTRACT" || value === "PART_TIME" || value === "CONTRACT") {
    return value;
  }
  return "FULL_TIME";
}

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.max(Math.floor(diffMs / (1000 * 60 * 60)), 0);

  if (diffHours < 1) {
    return "just now";
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}d ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

async function queryJobs(filters: {
  keyword: string;
  location: string;
  company: string;
  selectedLocationType: JobLocationType | "";
  selectedSeniority: JobSeniority | "";
  selectedEmploymentType: JobEmploymentType | "";
}): Promise<JobRow[]> {
  const andFilters: Prisma.JobPostingWhereInput[] = [];

  if (filters.keyword) {
    andFilters.push({
      OR: [
        { title: { contains: filters.keyword, mode: "insensitive" } },
        { company: { contains: filters.keyword, mode: "insensitive" } },
        { description: { contains: filters.keyword, mode: "insensitive" } },
      ],
    });
  }

  if (filters.location) {
    andFilters.push({
      company: { contains: filters.location, mode: "insensitive" },
    });
  }

  if (filters.company) {
    andFilters.push({
      company: { contains: filters.company, mode: "insensitive" },
    });
  }

  if (filters.selectedLocationType) {
    andFilters.push({
      locationType: LOCATION_TO_DB[filters.selectedLocationType],
    });
  }

  if (filters.selectedSeniority) {
    andFilters.push({
      seniority: SENIORITY_TO_DB[filters.selectedSeniority],
    });
  }

  if (filters.selectedEmploymentType) {
    andFilters.push({
      employmentType: EMPLOYMENT_TO_DB[filters.selectedEmploymentType],
    });
  }

  const where: Prisma.JobPostingWhereInput = andFilters.length ? { AND: andFilters } : {};

  return prisma.jobPosting.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      title: true,
      company: true,
      description: true,
      locationType: true,
      seniority: true,
      employmentType: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          userid: true,
          name: true,
        },
      },
    },
  });
}

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }): Promise<React.JSX.Element> {
  const params = await searchParams;
  const t = await getTranslations("ImitationX.Jobs");

  const locationTypeLabels: Record<JobLocationType, string> = {
    onsite: t("locationTypes.onsite"),
    remote: t("locationTypes.remote"),
    hybrid: t("locationTypes.hybrid"),
  };

  const seniorityLabels: Record<JobSeniority, string> = {
    intern: t("seniority.intern"),
    entry: t("seniority.entry"),
    junior: t("seniority.junior"),
    mid: t("seniority.mid"),
    senior: t("seniority.senior"),
    lead: t("seniority.lead"),
    manager: t("seniority.manager"),
    executive: t("seniority.executive"),
  };

  const employmentTypeLabels: Record<JobEmploymentType, string> = {
    "full-time": t("employmentTypes.fullTime"),
    "full-time-contract": t("employmentTypes.fullTimeContract"),
    "part-time": t("employmentTypes.partTime"),
    contract: t("employmentTypes.contract"),
  };

  const keyword = cleanSearchValue(getSingleValue(params.keyword));
  const location = cleanSearchValue(getSingleValue(params.location));
  const company = cleanSearchValue(getSingleValue(params.company));

  const locationTypeParam = getSingleValue(params.locationType);
  const seniorityParam = getSingleValue(params.seniority);
  const employmentTypeParam = getSingleValue(params.employmentType);

  const selectedLocationType: JobLocationType | "" = isJobLocationType(locationTypeParam) ? locationTypeParam : "";
  const selectedSeniority: JobSeniority | "" = isJobSeniority(seniorityParam) ? seniorityParam : "";
  const selectedEmploymentType: JobEmploymentType | "" = isJobEmploymentType(employmentTypeParam)
    ? employmentTypeParam
    : "";

  const jobs = await queryJobs({
    keyword,
    location,
    company,
    selectedLocationType,
    selectedSeniority,
    selectedEmploymentType,
  });

  return (
    <div className="px-4 py-4 sm:px-6">
      <div className="space-y-6">
        <section className="rounded-3xl border border-border/70 bg-gradient-to-br from-background via-background to-muted/40 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("title")}</h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{t("subtitle")}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm shadow-sm backdrop-blur">
              <p className="text-muted-foreground">{t("resultsLabel")}</p>
              <p className="text-2xl font-semibold tracking-tight">{jobs.length}</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              const locationType = DB_TO_LOCATION[toDbLocationType(job.locationType)];
              const seniority = DB_TO_SENIORITY[toDbSeniority(job.seniority)];
              const employmentType = DB_TO_EMPLOYMENT[toDbEmploymentType(job.employmentType)];

              return (
                <article
                  key={job.id}
                  className="rounded-3xl border border-border/70 bg-background p-5 shadow-sm transition-colors hover:border-primary/30 sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{job.company}</span>
                          <span aria-hidden="true">-</span>
                          <span>@{job.author.userid}</span>
                          <span aria-hidden="true">-</span>
                          <span>{formatRelativeTime(job.createdAt)}</span>
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-xl font-semibold tracking-tight text-foreground">{job.title}</h2>
                          {job.description ? (
                            <p className="line-clamp-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                              {job.description}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="rounded-full">
                          {locationTypeLabels[locationType]}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full">
                          {seniorityLabels[seniority]}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full">
                          {employmentTypeLabels[employmentType]}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-stretch">
                      <div className="flex min-w-32 items-center gap-2 rounded-2xl border border-border/70 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                        <BriefcaseBusiness className="size-4" />
                        <span>{job.author.name || `@${job.author.userid}`}</span>
                      </div>
                      <Button className="rounded-full bg-[#1D9BF0] text-white hover:bg-[#1a8cd8]" asChild>
                        <Link href={`/gekaixing/chat?userId=${job.author.id}`}>{t("actions.apply")}</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center shadow-sm">
              <div className="mx-auto max-w-md space-y-3">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("empty.title")}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{t("empty.description")}</p>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/gekaixing/jobs">{t("actions.clearFilters")}</Link>
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
