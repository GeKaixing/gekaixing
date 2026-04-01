export const LOCATION_TYPES = ["ONSITE", "REMOTE", "HYBRID"] as const;
export type LocationType = (typeof LOCATION_TYPES)[number];

export const SENIORITY_LEVELS = [
  "INTERN",
  "ENTRY",
  "JUNIOR",
  "MID",
  "SENIOR",
  "LEAD",
  "MANAGER",
  "EXECUTIVE",
] as const;
export type SeniorityLevel = (typeof SENIORITY_LEVELS)[number];

export const EMPLOYMENT_TYPES = ["FULL_TIME", "FULL_TIME_CONTRACT", "PART_TIME", "CONTRACT"] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export interface CreateJobPostingBody {
  title?: string;
  company?: string;
  description?: string;
  locationType?: LocationType;
  seniority?: SeniorityLevel;
  employmentType?: EmploymentType;
}
