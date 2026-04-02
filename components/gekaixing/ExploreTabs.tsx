"use client";

import { useEffect, useState } from "react";
import { ChartNoAxesColumn } from "lucide-react";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import NEWs from "./NEWs";

interface ToutiaoHotItem {
  url: string;
  title: string;
  hot_value: string;
}

export async function ToutiaoHotGTE() {
  return await fetch("https://dabenshi.cn/other/api/hot.php?type=toutiaoHot", {
    method: "GET",
    next: {
      revalidate: 60,
    },
    cache: "force-cache",
  });
}

export default
function ExploreTabs() {
  const [data, setData] = useState<ToutiaoHotItem[]>([]);

  useEffect(() => {
    async function fetchf(): Promise<void> {
      try {
        const result = await ToutiaoHotGTE();
        const json = (await result.json()) as { success?: boolean; data?: ToutiaoHotItem[] };
        if (json.success) {
          setData(Array.isArray(json.data) ? json.data : []);
        }
      } catch (error) {
        console.error(error);
        setData([]);
      }
    }
    void fetchf();
  }, []);

  return (
    <Tabs defaultValue="ToutiaoHot" className="mt-2 w-full">
      <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto bg-muted/60 p-1">
        <TabsTrigger value="ToutiaoHot" className="shrink-0 rounded-full px-3 py-1.5 text-xs sm:text-sm">
          今日头条
        </TabsTrigger>
        <TabsTrigger value="us" className="shrink-0 rounded-full px-3 py-1.5 text-xs sm:text-sm">
          美国
        </TabsTrigger>
        <TabsTrigger value="tech" className="shrink-0 rounded-full px-3 py-1.5 text-xs sm:text-sm">
          科技
        </TabsTrigger>
        <TabsTrigger value="sports" className="shrink-0 rounded-full px-3 py-1.5 text-xs sm:text-sm">
          体育
        </TabsTrigger>
        <TabsTrigger value="entertainment" className="shrink-0 rounded-full px-3 py-1.5 text-xs sm:text-sm">
          娱乐
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ToutiaoHot" className="mt-3">
        {data.length !== 0 &&
          data.map((item, idx) => (
            <Link
              href={item.url}
              key={idx}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-20 flex-col justify-start rounded-2xl border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/60"
            >
              <span className="line-clamp-2 text-sm text-foreground sm:text-base">{item.title}</span>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
                <ChartNoAxesColumn className="h-4 w-4" /> <span>{item.hot_value}</span>
              </div>
            </Link>
          ))}
      </TabsContent>
      <TabsContent value="us">
        <NEWs url="/api/news/hot-us?category=us" />
      </TabsContent>
      <TabsContent value="tech">
        <NEWs url="/api/news/hot-us?category=tech" />
      </TabsContent>
      <TabsContent value="sports">
        <NEWs url="/api/news/hot-us?category=sports" />
      </TabsContent>
      <TabsContent value="entertainment">
        <NEWs url="/api/news/hot-us?category=entertainment" />
      </TabsContent>
    </Tabs>
  );
}
