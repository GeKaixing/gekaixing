import { createClient } from "@/utils/supabase/client";

export const config = {
  runtime: "edge",
};

export default async function handler() {
  const supabase = createClient();

  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${process.env.NEXT_PUBLIC_NEWs_key}`
  );
  const { articles } = await res.json();

  for (const article of articles) {
    await supabase.from("news-us").insert({
      title: article.title,
      url: article.url,
      publishedAt: article.publishedAt,
      source_id: article.source?.id,
      source_name: article.source?.name,
      content: article.content,
      description: article.description,
      author: article.author,
      urlToImage: article.urlToImage,
    });
  }

  return new Response("ok");
}
