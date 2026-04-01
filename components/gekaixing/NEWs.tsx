"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface NewsItem {
  url: string;
  source_name: string;
  title: string;
  summary?: string;
  author?: string;
}

interface NewsResponse {
  success?: boolean;
  data?: NewsItem[];
  error?: string;
}

async function newsFetch(url: string): Promise<Response> {
  return fetch(url, {
    cache: "no-store",
  });
}

export default function NEWs({ url }: { url: string }) {
  const [data, setData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNews(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const result = await newsFetch(url);
        const json = (await result.json()) as NewsResponse;
        if (!result.ok || !json.success) {
          throw new Error(json.error ?? "Failed to load news");
        }

        if (!cancelled) {
          setData(Array.isArray(json.data) ? json.data : []);
        }
      } catch (fetchError) {
        if (!cancelled) {
          console.error(fetchError);
          setData([]);
          setError(fetchError instanceof Error ? fetchError.message : "Failed to load news");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadNews();
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (loading) {
    return <div className="rounded-2xl border p-3 text-sm text-muted-foreground">加载中...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border p-3 text-sm text-muted-foreground">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="rounded-2xl border p-3 text-sm text-muted-foreground">暂无新闻</div>;
  }

  return (
    <div className="space-y-1">
      {data.map((item, index) => (
        <Link
          href={item.url}
          key={`${item.url}-${index}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col justify-start rounded-2xl p-2 py-2 transition-colors hover:bg-muted/60"
        >
          <span className="text-base font-semibold text-foreground">{item.source_name}</span>
          <span className="text-foreground">{item.title}</span>
          <span className="line-clamp-2 text-sm text-muted-foreground">{item.summary ?? item.author ?? ""}</span>
        </Link>
      ))}
    </div>
  );
}
