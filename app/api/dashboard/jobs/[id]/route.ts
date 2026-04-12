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

async function getAuthedUser(): Promise<{ id: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return { id: user.id };
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const jobId = cleanText(id, 64);
    if (!jobId) {
      return NextResponse.json({ success: false, error: "Invalid job id" }, { status: 400 });
    }

    const existing = await prisma.jobPosting.findFirst({
      where: {
        id: jobId,
        authorId: user.id,
      },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Job posting not found" }, { status: 404 });
    }

    const body = (await request.json()) as CreateJobPostingBody;
    const title = cleanText(body.title, 100);
    const company = cleanText(body.company, 100);
    const description = cleanLongText(body.description, 3000);
    const locationType = cleanText(body.locationType, 32);
    const seniority = cleanText(body.seniority, 32);
    const employmentType = cleanText(body.employmentType, 40);

    if (!title || !company || !description || !locationType || !seniority || !employmentType) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
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

    const row = await prisma.jobPosting.update({
      where: { id: jobId },
      data: {
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
    console.error("Failed to update job posting:", error);
    return NextResponse.json({ success: false, error: "Failed to update job posting" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const jobId = cleanText(id, 64);
    if (!jobId) {
      return NextResponse.json({ success: false, error: "Invalid job id" }, { status: 400 });
    }

    const existing = await prisma.jobPosting.findFirst({
      where: {
        id: jobId,
        authorId: user.id,
      },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Job posting not found" }, { status: 404 });
    }

    await prisma.jobPosting.delete({
      where: { id: jobId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete job posting:", error);
    return NextResponse.json({ success: false, error: "Failed to delete job posting" }, { status: 500 });
  }
}
