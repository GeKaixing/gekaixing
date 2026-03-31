"use client"

import { useTranslations } from "next-intl";

import { createClient } from "@/utils/supabase/client";

import Button from "./Button";

export default function GoogleButton() {
  const t = useTranslations("Account.GoogleButton");

  async function googleLogin(): Promise<void> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google OAuth init failed:", error.message);
      return;
    }

    if (data.url) {
      window.location.assign(data.url);
    }
  }

  return (
    <Button className="inline-flex items-center gap-2" onClick={googleLogin}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0">
        <path
          d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.08 3.56-5.15 3.56-8.65Z"
          fill="#4285F4"
        />
        <path
          d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.77-2.1-6.72-4.93H1.27v3.1A12 12 0 0 0 12 24Z"
          fill="#34A853"
        />
        <path
          d="M5.28 14.32A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.58.38-2.32v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.78 1.27 5.42l4.01-3.1Z"
          fill="#FBBC05"
        />
        <path
          d="M12 4.75c1.76 0 3.35.6 4.6 1.78l3.45-3.45C17.95 1.1 15.23 0 12 0A12 12 0 0 0 1.27 6.58l4.01 3.1c.95-2.83 3.59-4.93 6.72-4.93Z"
          fill="#EA4335"
        />
      </svg>
      <span>{t("signInWithGoogle")}</span>
    </Button>
  );
}
