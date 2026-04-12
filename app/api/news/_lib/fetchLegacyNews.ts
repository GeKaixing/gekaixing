import { prisma } from "@/lib/prisma";

export type NewsCategory = "us" | "sports" | "entertainment" | "techcrunch";

const TABLE_MAP: Record<NewsCategory, string> = {
  us: "news-us",
  sports: "news-sports",
  entertainment: "news-entertainment",
  techcrunch: "news-techcrunch",
};

export interface LegacyNewsRow {
  [key: string]: unknown;
}

export async function fetchLegacyNews(category: NewsCategory, limit: number = 20): Promise<LegacyNewsRow[]> {
  const tableName = TABLE_MAP[category];
  const safeLimit = Math.max(1, Math.min(100, Math.trunc(limit)));
  const query = `SELECT * FROM "${tableName}" ORDER BY created_at DESC LIMIT ${safeLimit}`;
  return (await prisma.$queryRawUnsafe(query)) as LegacyNewsRow[];
}
