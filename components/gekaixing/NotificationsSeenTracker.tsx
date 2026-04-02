"use client";

import { useEffect } from "react";

export default function NotificationsSeenTracker() {
  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/notifications/seen", {
      method: "POST",
      signal: controller.signal,
      credentials: "same-origin",
      cache: "no-store",
    }).catch(() => {
      // Silent fail: badge will update on next successful seen write.
    });

    return () => {
      controller.abort();
    };
  }, []);

  return null;
}
