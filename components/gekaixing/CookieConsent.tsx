"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const CONSENT_COOKIE_KEY = "cookie_consent";
const CONSENT_COOKIE_VALUE = "accepted";
const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function hasConsentCookie(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie.split("; ").some((cookie: string) => cookie === `${CONSENT_COOKIE_KEY}=${CONSENT_COOKIE_VALUE}`);
}

export default function CookieConsent(): React.JSX.Element | null {
  const [visible, setVisible] = useState(false);

  useEffect((): void => {
    setVisible(!hasConsentCookie());
  }, []);

  const handleAccept = (): void => {
    document.cookie = `${CONSENT_COOKIE_KEY}=${CONSENT_COOKIE_VALUE}; Path=/; Max-Age=${CONSENT_COOKIE_MAX_AGE}; SameSite=Lax`;
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 border-zinc-200 bg-white text-zinc-900 shadow-lg dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 sm:left-auto sm:max-w-[420px]">
      <CardContent className="pt-6 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        This website uses cookies to ensure you get the best experience.
        {" "}
        <Link href="/cookies" className="font-medium text-zinc-900 underline underline-offset-2 dark:text-zinc-100">
          Cookies Policy
        </Link>
      </CardContent>
      <CardFooter>
        <Button className="h-9 bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200" onClick={handleAccept}>
          Got it
        </Button>
      </CardFooter>
    </Card>
  );
}
