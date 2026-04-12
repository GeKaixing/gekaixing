import { rm } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

function normalizeRelativePath(input: string): string {
  const normalized = path.posix.normalize(input).replace(/^\/+/, "");
  if (!normalized || normalized.includes("..")) {
    throw new Error("Invalid file path");
  }
  return normalized;
}

export const runtime = "nodejs";

interface DeleteBody {
  bucket: string;
  paths: string[];
}

export async function POST(request: Request) {
  const body = (await request.json()) as DeleteBody;

  if (!body.bucket || !Array.isArray(body.paths)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const safeBucket = normalizeRelativePath(body.bucket);
    await Promise.all(
      body.paths.map(async (item) => {
        const safePath = normalizeRelativePath(item);
        const targetFile = path.join(process.cwd(), "public", "uploads", safeBucket, safePath);
        await rm(targetFile, { force: true });
      }),
    );

    return NextResponse.json({ data: body.paths, error: null });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 },
    );
  }
}
