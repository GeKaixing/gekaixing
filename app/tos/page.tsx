import Link from "next/link"
import { getTranslations } from "next-intl/server"

export default async function TosPage(): Promise<React.JSX.Element> {
  const t = await getTranslations("Legal.Tos")
  const common = await getTranslations("NoirPages.common")
  const legal = await getTranslations("NoirPages.legal")

  return (
    <main className="min-h-screen bg-white px-6 py-14 text-zinc-950 dark:bg-[#050912] dark:text-white md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300">{legal("tos")}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">{t("title")}</h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
          {t("updatedDateLabel")} {t("updatedDate")}
        </p>

        <div className="mt-10 space-y-4">
          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="text-xl font-semibold">{t("sections.acceptance.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{t("sections.acceptance.body")}</p>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="text-xl font-semibold">{t("sections.usage.title")}</h2>
            <ul className="mt-2 list-inside list-disc space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              <li>{t("sections.usage.items.0")}</li>
              <li>{t("sections.usage.items.1")}</li>
              <li>{t("sections.usage.items.2")}</li>
              <li>{t("sections.usage.items.3")}</li>
            </ul>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="text-xl font-semibold">{t("sections.account.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{t("sections.account.body")}</p>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="text-xl font-semibold">{t("sections.ip.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{t("sections.ip.body")}</p>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="text-xl font-semibold">{t("sections.disclaimer.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{t("sections.disclaimer.body")}</p>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="text-xl font-semibold">{t("sections.termination.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{t("sections.termination.body")}</p>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="text-xl font-semibold">{t("sections.contact.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {t("sections.contact.body")}
              <br />
              {t("sections.contact.emailLabel")}{" "}
              <a href="mailto:contact@gekaixing.com" className="text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">
                contact@gekaixing.com
              </a>
            </p>
          </section>

          <div className="pt-4">
            <Link href="/" className="text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">
              {common("backToHome")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
