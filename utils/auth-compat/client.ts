"use client";

import { signIn, signOut } from "next-auth/react";

type ClientUser = {
  id: string;
  email: string;
  user_metadata: Record<string, string>;
};

type AuthResult = {
  data: { user: ClientUser | null };
  error: Error | null;
};

type UpdateUserPayload = {
  email?: string;
  password?: string;
  data?: Record<string, unknown>;
};

async function fetchCurrentUser(): Promise<AuthResult> {
  try {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    if (!response.ok) {
      return {
        data: { user: null },
        error: new Error("Unauthorized"),
      };
    }

    const result = (await response.json()) as { user?: ClientUser };
    return {
      data: { user: result.user ?? null },
      error: null,
    };
  } catch (error) {
    return {
      data: { user: null },
      error: error instanceof Error ? error : new Error("Failed to fetch user"),
    };
  }
}

async function updateUser(payload: UpdateUserPayload): Promise<AuthResult> {
  try {
    const response = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { user?: ClientUser; error?: string };

    if (!response.ok || !result.user) {
      return {
        data: { user: null },
        error: new Error(result.error ?? "Failed to update user"),
      };
    }

    return {
      data: { user: result.user },
      error: null,
    };
  } catch (error) {
    return {
      data: { user: null },
      error: error instanceof Error ? error : new Error("Failed to update user"),
    };
  }
}

function unsupportedStorageError(): Error {
  return new Error("Supabase Storage has been removed. Please migrate uploads to local/object storage.");
}

function buildPublicUrl(bucket: string, filePath: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const normalizedPath = filePath.replace(/^\/+/, "");
  return `${origin}/uploads/${bucket}/${normalizedPath}`;
}

export const createClient = () => {
  return {
    auth: {
      getUser: async (): Promise<AuthResult> => {
        return await fetchCurrentUser();
      },
      updateUser: async (payload: UpdateUserPayload, _options?: unknown): Promise<AuthResult> => {
        return await updateUser(payload);
      },
      signInWithOAuth: async ({
        provider,
        options,
      }: {
        provider: string;
        options?: { redirectTo?: string };
      }): Promise<{ data: { url: string | null }; error: Error | null }> => {
        const callbackUrl = options?.redirectTo ?? "/gekaixing";
        const result = await signIn(provider, {
          callbackUrl,
          redirect: false,
        });

        if (result?.error) {
          return {
            data: { url: null },
            error: new Error(result.error),
          };
        }

        if (!result?.url) {
          return {
            data: { url: null },
            error: new Error("OAuth provider is not configured"),
          };
        }

        return {
          data: { url: result.url },
          error: null,
        };
      },
      signOut: async (): Promise<{ error: null }> => {
        await signOut({ redirect: false });
        return { error: null };
      },
    },
    storage: {
      from: (bucket: string) => {
        return {
          upload: async (filePath: string, file: File, _options?: unknown) => {
            try {
              const formData = new FormData();
              formData.append("bucket", bucket);
              formData.append("filePath", filePath);
              formData.append("file", file);

              const response = await fetch("/api/storage/upload", {
                method: "POST",
                body: formData,
              });
              const result = (await response.json()) as {
                data?: { path: string; publicUrl: string };
                error?: string;
              };

              if (!response.ok || !result.data) {
                return { data: null, error: new Error(result.error ?? "Upload failed") };
              }

              return {
                data: { path: result.data.path },
                error: null,
              };
            } catch (error) {
              return {
                data: null,
                error: error instanceof Error ? error : unsupportedStorageError(),
              };
            }
          },
          remove: async (paths: string[]) => {
            try {
              const response = await fetch("/api/storage/delete", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ bucket, paths }),
              });
              const result = (await response.json()) as {
                data?: string[];
                error?: string;
              };

              if (!response.ok) {
                return { data: null, error: new Error(result.error ?? "Delete failed") };
              }

              return { data: result.data ?? [], error: null };
            } catch (error) {
              return {
                data: null,
                error: error instanceof Error ? error : unsupportedStorageError(),
              };
            }
          },
          list: async (..._args: unknown[]) => ({ data: [], error: null }),
          getPublicUrl: (filePath: string) => ({
            data: { publicUrl: buildPublicUrl(bucket, filePath) },
          }),
        };
      },
    },
    channel: (_name: string) => {
      const state = {
        on: (_type: string, _event: unknown, _handler: unknown) => state,
        subscribe: (_handler?: (status: string) => void) => {
          return state;
        },
        unsubscribe: () => {
          return;
        },
        send: async (_payload: unknown) => {
          return { error: null };
        },
      };

      return state;
    },
  };
};
