const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;
const URL_REGEX = /https?:\/\/[^\s<>"']+/gi;

function decodeHtmlEntities(value: string): string {
  return value.replace(/&amp;/gi, "&").replace(/&#x26;/gi, "&");
}

function trimUrl(rawUrl: string): string {
  return rawUrl.trim().replace(/[),.;!?]+$/g, "");
}

function getYoutubeVideoId(urlString: string): string | null {
  try {
    const normalizedUrl = decodeHtmlEntities(trimUrl(urlString));
    const url = new URL(normalizedUrl);
    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();

    if (hostname === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0] ?? "";
      return YOUTUBE_ID_REGEX.test(id) ? id : null;
    }

    const isYoutubeHost =
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "music.youtube.com" ||
      hostname === "youtube-nocookie.com";

    if (!isYoutubeHost) {
      return null;
    }

    const watchId = url.searchParams.get("v");
    if (watchId && YOUTUBE_ID_REGEX.test(watchId)) {
      return watchId;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      return null;
    }

    const [prefix, id] = parts;
    if (!id || !YOUTUBE_ID_REGEX.test(id)) {
      return null;
    }

    if (prefix === "shorts" || prefix === "embed" || prefix === "live" || prefix === "v") {
      return id;
    }

    return null;
  } catch {
    return null;
  }
}

export function toYouTubeEmbedUrl(url: string): string | null {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) {
    return null;
  }
  return `https://www.youtube.com/embed/${videoId}`;
}

export function extractYouTubeEmbedUrls(content: string): string[] {
  const urls = content.match(URL_REGEX) ?? [];
  const embeds: string[] = [];
  const seen = new Set<string>();

  for (const url of urls) {
    const embedUrl = toYouTubeEmbedUrl(url);
    if (!embedUrl || seen.has(embedUrl)) {
      continue;
    }
    seen.add(embedUrl);
    embeds.push(embedUrl);
  }

  return embeds;
}

export function extractYouTubeEmbedUrl(content: string): string | null {
  const embeds = extractYouTubeEmbedUrls(content);
  return embeds[0] ?? null;
}

export function removeYouTubeLinks(content: string): string {
  const urls = content.match(URL_REGEX) ?? [];
  if (urls.length === 0) {
    return content;
  }

  let nextContent = content;

  for (const url of urls) {
    if (!getYoutubeVideoId(url)) {
      continue;
    }

    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const anchorPattern = new RegExp(
      `<a\\b[^>]*href=["']${escapedUrl}["'][^>]*>[\\s\\S]*?<\\/a>`,
      "gi"
    );
    const plainUrlPattern = new RegExp(escapedUrl, "gi");

    nextContent = nextContent.replace(anchorPattern, "");
    nextContent = nextContent.replace(plainUrlPattern, "");
  }

  nextContent = nextContent
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/<p>(?:&nbsp;|\s|<br\s*\/?>)*<\/p>/gi, "")
    .trim();

  return nextContent;
}
