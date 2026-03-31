import Link from "next/link"
import { getTranslations } from "next-intl/server"

type AccessibilityPoint = {
  key: "readable" | "keyboard" | "improve"
}

const accessibilityPoints: AccessibilityPoint[] = [{ key: "readable" }, { key: "keyboard" }, { key: "improve" }]

export default async function AccessibilityPage(): Promise<React.JSX.Element> {
  const t = await getTranslations("NoirPages.accessibility")
  const common = await getTranslations("NoirPages.common")

  return (
    <main className="min-h-screen bg-white px-6 py-14 text-zinc-950 dark:bg-[#050912] dark:text-white md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300">{t("badge")}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">{t("title")}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">{t("description")}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {accessibilityPoints.map((point: AccessibilityPoint) => (
            <article key={point.key} className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold">{t(`points.${point.key}.title`)}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{t(`points.${point.key}.description`)}</p>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">
            {common("backToHome")}
          </Link>
        </div>
      </div>
    </main>
  )
}
