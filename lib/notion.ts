// lib/notion.ts
import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN, // 记得在 .env.local 里设置
});

export async function getDatabase(databaseId: string) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  return response.results;
}

export async function getPage(pageId: string) {
  return await notion.pages.retrieve({ page_id: pageId });
}
