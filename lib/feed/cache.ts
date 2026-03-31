import crypto from "node:crypto";
import type { FeedCachePayload, FeedPageCachePayload } from "@/lib/feed/types";

const FEED_CACHE_TTL_SECONDS = 300;
const FEED_CACHE_STALE_MS = 2 * 60 * 1000;
const FEED_CACHE_PREFIX = "feed:user";
const FEED_LOCK_TTL_SECONDS = 15;

function getRedisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

async function runRedisCommand(command: Array<string | number>): Promise<unknown> {
  const config = getRedisConfig();
  if (!config) {
    return null;
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis command failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { result?: unknown; error?: string };
  if (payload.error) {
    throw new Error(payload.error);
  }

  return payload.result ?? null;
}

function getResolvedUserId(userId: string | null): string {
  return userId ?? "anon";
}

export function getFeedRankedCacheKey(userId: string | null): string {
  return `${FEED_CACHE_PREFIX}:${getResolvedUserId(userId)}`;
}

export function getFeedPageCacheKey(userId: string | null, page: number): string {
  return `${FEED_CACHE_PREFIX}:${getResolvedUserId(userId)}:page:${page}`;
}

function getFeedLockKey(userId: string | null): string {
  return `${FEED_CACHE_PREFIX}:${getResolvedUserId(userId)}:recompute:lock`;
}

export async function getFeedCache(userId: string | null): Promise<FeedCachePayload | null> {
  try {
    const raw = await runRedisCommand(["GET", getFeedRankedCacheKey(userId)]);
    if (typeof raw !== "string") {
      return null;
    }

    const parsed = JSON.parse(raw) as FeedCachePayload;
    if (!Array.isArray(parsed.postIds) || typeof parsed.computedAt !== "number") {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to read feed cache:", error);
    return null;
  }
}

export async function setFeedCache(userId: string | null, payload: FeedCachePayload): Promise<void> {
  try {
    await runRedisCommand([
      "SET",
      getFeedRankedCacheKey(userId),
      JSON.stringify(payload),
      "EX",
      FEED_CACHE_TTL_SECONDS,
    ]);
  } catch (error) {
    console.error("Failed to write feed cache:", error);
  }
}

export async function getFeedPageCache(
  userId: string | null,
  page: number
): Promise<FeedPageCachePayload | null> {
  try {
    const raw = await runRedisCommand(["GET", getFeedPageCacheKey(userId, page)]);
    if (typeof raw !== "string") {
      return null;
    }

    const parsed = JSON.parse(raw) as FeedPageCachePayload;
    if (
      !Array.isArray(parsed.postIds) ||
      typeof parsed.computedAt !== "number" ||
      typeof parsed.hasMore !== "boolean" ||
      typeof parsed.limit !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to read feed page cache:", error);
    return null;
  }
}

export async function setFeedPageCache(
  userId: string | null,
  page: number,
  payload: FeedPageCachePayload
): Promise<void> {
  try {
    await runRedisCommand([
      "SET",
      getFeedPageCacheKey(userId, page),
      JSON.stringify(payload),
      "EX",
      FEED_CACHE_TTL_SECONDS,
    ]);
  } catch (error) {
    console.error("Failed to write feed page cache:", error);
  }
}

export async function deleteFeedCache(userId: string | null): Promise<void> {
  try {
    const resolvedUserId = getResolvedUserId(userId);
    const pagePattern = `${FEED_CACHE_PREFIX}:${resolvedUserId}:page:*`;
    const keysRaw = await runRedisCommand(["KEYS", pagePattern]);
    const keys = Array.isArray(keysRaw) ? keysRaw.filter((key): key is string => typeof key === "string") : [];
    const commands: Array<Array<string | number>> = [["DEL", getFeedRankedCacheKey(userId)]];

    keys.forEach((key) => {
      commands.push(["DEL", key]);
    });

    await Promise.all(commands.map((command) => runRedisCommand(command)));
  } catch (error) {
    console.error("Failed to delete feed cache:", error);
  }
}

export function isFeedCacheStale(payload: FeedCachePayload): boolean {
  return Date.now() - payload.computedAt > FEED_CACHE_STALE_MS;
}

export interface FeedRecomputeLock {
  key: string;
  token: string;
}

export async function tryAcquireFeedRecomputeLock(userId: string | null): Promise<FeedRecomputeLock | null> {
  try {
    const key = getFeedLockKey(userId);
    const token = crypto.randomUUID();
    const result = await runRedisCommand(["SET", key, token, "EX", FEED_LOCK_TTL_SECONDS, "NX"]);

    if (result !== "OK") {
      return null;
    }

    return { key, token };
  } catch (error) {
    console.error("Failed to acquire feed recompute lock:", error);
    return null;
  }
}

export async function releaseFeedRecomputeLock(lock: FeedRecomputeLock): Promise<void> {
  try {
    const currentToken = await runRedisCommand(["GET", lock.key]);
    if (currentToken === lock.token) {
      await runRedisCommand(["DEL", lock.key]);
    }
  } catch (error) {
    console.error("Failed to release feed recompute lock:", error);
  }
}
