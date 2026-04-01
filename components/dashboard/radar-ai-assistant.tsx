"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RadarHotspotItem {
  title: string;
  summary: string;
  whyRelated: string;
}

interface RadarPostIdea {
  title: string;
  content: string;
}

interface RadarAssistantPayload {
  success: boolean;
  region?: string;
  hotspots?: RadarHotspotItem[];
  keywords?: string[];
  postIdeas?: RadarPostIdea[];
  error?: string;
}

export function RadarAiAssistant(): React.JSX.Element {
  const t = useTranslations("Dashboard.radar");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [hotspots, setHotspots] = useState<RadarHotspotItem[]>([]);
  const [postIdeas, setPostIdeas] = useState<RadarPostIdea[]>([]);

  const handleGenerate = async (): Promise<void> => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/dashboard/radar/hotspot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const payload = (await response.json()) as RadarAssistantPayload;
      if (!response.ok || !payload.success) {
        setError(payload.error ?? t("aiFailed"));
        return;
      }

      setRegion(payload.region ?? "");
      setKeywords(payload.keywords ?? []);
      setHotspots(payload.hotspots ?? []);
      setPostIdeas(payload.postIdeas ?? []);
    } catch (requestError) {
      console.error("Failed to generate radar AI insights:", requestError);
      setError(t("aiFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">{t("aiDesc")}</div>
        <Button onClick={() => void handleGenerate()} disabled={loading}>
          {loading ? t("aiLoading") : t("aiGenerate")}
        </Button>
      </div>

      {error ? <div className="text-sm text-red-500">{error}</div> : null}

      {region ? (
        <div className="rounded-md border p-3 text-sm">
          <span className="font-medium">{t("aiRegion")}:</span> {region}
        </div>
      ) : null}

      {keywords.length ? (
        <div className="space-y-2">
          <div className="text-sm font-medium">{t("aiKeywords")}</div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {hotspots.length ? (
        <div className="space-y-2">
          <div className="text-sm font-medium">{t("aiHotspots")}</div>
          <div className="grid grid-cols-1 gap-2">
            {hotspots.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-md border p-3">
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{item.summary}</div>
                <div className="mt-2 text-xs text-muted-foreground">{item.whyRelated}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {postIdeas.length ? (
        <div className="space-y-2">
          <div className="text-sm font-medium">{t("aiPostIdeas")}</div>
          <div className="grid grid-cols-1 gap-2">
            {postIdeas.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-md border p-3">
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{item.content}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

