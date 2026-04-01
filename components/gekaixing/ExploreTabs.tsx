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
      <TabsList className="flex w-full justify-between bg-muted/60">
        <TabsTrigger value="ToutiaoHot">今日头条</TabsTrigger>
        <TabsTrigger value="us">美国</TabsTrigger>
        <TabsTrigger value="tech">科技</TabsTrigger>
        <TabsTrigger value="sports">体育</TabsTrigger>
        <TabsTrigger value="entertainment">娱乐</TabsTrigger>
      </TabsList>
      <TabsContent value="ToutiaoHot" className="mt-3">
        {data.length !== 0 &&
          data.map((item, idx) => (
            <Link
              href={item.url}
              key={idx}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-start rounded-2xl p-2 py-1 transition-colors hover:bg-muted/60"
            >
              <span className="text-foreground">{item.title}</span>
              <div className="flex items-center gap-1 text-muted-foreground">
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
