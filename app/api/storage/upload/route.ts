import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

function normalizeRelativePath(input: string): string {
  const normalized = path.posix.normalize(input).replace(/^\/+/, "");
  if (!normalized || normalized.includes("..")) {
    throw new Error("Invalid file path");
  }
  return normalized;
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const bucket = String(formData.get("bucket") ?? "uploads");
  const filePath = String(formData.get("filePath") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!filePath) {
    return NextResponse.json({ error: "Missing filePath" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  try {
    const safeBucket = normalizeRelativePath(bucket);
    const safePath = normalizeRelativePath(filePath);

    const targetDir = path.join(process.cwd(), "public", "uploads", safeBucket, path.dirname(safePath));
    const targetFile = path.join(process.cwd(), "public", "uploads", safeBucket, safePath);

    await mkdir(targetDir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(targetFile, bytes);

    const publicUrl = `/uploads/${safeBucket}/${safePath}`;
    return NextResponse.json({ data: { path: safePath, publicUrl }, error: null });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
