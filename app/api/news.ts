
export const config = {
  runtime: "edge",
};

export default async function handler() {
  // 从环境变量中获取 Supabase URL 和 Anon Key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const newsRes = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${process.env.NEXT_PUBLIC_NEWs_key}`
  );
  const { articles } = await newsRes.json();

  // 构建插入数据
  const newsData = articles.map((article: { title: any; url: any; publishedAt: any; source: { id: any; name: any; }; content: any; description: any; author: any; urlToImage: any; }) => ({
    title: article.title,
    url: article.url,
    publishedAt: article.publishedAt,
    source_id: article.source?.id,
    source_name: article.source?.name,
    content: article.content,
    description: article.description,
    author: article.author,
    urlToImage: article.urlToImage,
  }));

  try {
    // 使用 REST API 批量插入数据
    const response = await fetch(`${supabaseUrl}/rest/v1/news-us`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey as string,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify(newsData),
    });

    if (!response.ok) {
      throw new Error(`Supabase insert failed: ${await response.text()}`);
    }

    console.log("Supabase insert successful!");
    return new Response("ok", { status: 200 });

  } catch (error) {
    console.error("Supabase API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}