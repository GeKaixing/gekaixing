import { NextResponse } from "next/server";

import { EMPLOYMENT_TYPES, LOCATION_TYPES, SENIORITY_LEVELS, type CreateJobPostingBody } from "@/lib/dashboard/job-posting";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/auth-compat/server";

function cleanText(value?: string, maxLength: number = 120): string {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanLongText(value?: string, maxLength: number = 3000): string {
  return (value ?? "").replace(/\r\n/g, "\n").trim().slice(0, maxLength);
}

function isInArray<T extends readonly string[]>(value: string, target: T): value is T[number] {
  return target.includes(value as T[number]);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreateJobPostingBody;
    const title = cleanText(body.title, 100);
    const company = cleanText(body.company, 100);
    const description = cleanLongText(body.description, 3000);
    const locationType = cleanText(body.locationType, 32);
    const seniority = cleanText(body.seniority, 32);
    const employmentType = cleanText(body.employmentType, 40);

    if (!title || !company || !description || !locationType || !seniority || !employmentType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    if (!isInArray(locationType, LOCATION_TYPES)) {
      return NextResponse.json({ success: false, error: "Invalid location type" }, { status: 400 });
    }

    if (!isInArray(seniority, SENIORITY_LEVELS)) {
      return NextResponse.json({ success: false, error: "Invalid seniority level" }, { status: 400 });
    }

    if (!isInArray(employmentType, EMPLOYMENT_TYPES)) {
      return NextResponse.json({ success: false, error: "Invalid employment type" }, { status: 400 });
    }

    const row = await prisma.jobPosting.create({
      data: {
        authorId: user.id,
        title,
        company,
        description,
        locationType,
        seniority,
        employmentType,
      },
    });

    return NextResponse.json({ success: true, data: row });
  } catch (error) {
    console.error("Failed to create job posting:", error);
    return NextResponse.json({ success: false, error: "Failed to create job posting" }, { status: 500 });
  }
}
