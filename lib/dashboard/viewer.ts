import { cache } from "react";

import { createClient } from "@/utils/supabase/server";

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeout);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}

export const getDashboardViewer = cache(async (): Promise<{ userId: string | null }> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await withTimeout(supabase.auth.getUser(), 5000);

    return { userId: user?.id ?? null };
  } catch (error) {
    console.error("Failed to resolve dashboard viewer:", error);
    return { userId: null };
  }
});
