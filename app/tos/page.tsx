import Navbar from '@/components/gekaixing/Navbar'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export default async function TosPage() {
  const t = await getTranslations('Legal.Tos')

  return (
    <>
      <Navbar />
      <div className='container mx-auto p-4 md:p-8'>
        <div className='prose max-w-none'>
          <h1 className='mb-6 text-3xl font-bold'>{t('title')}</h1>
          <p className='mb-8 text-sm text-gray-500'>
            {t('updatedDateLabel')} {t('updatedDate')}
          </p>

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.acceptance.title')}</h2>
            <p>{t('sections.acceptance.body')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.usage.title')}</h2>
            <ul className='list-inside list-disc space-y-2'>
              <li>{t('sections.usage.items.0')}</li>
              <li>{t('sections.usage.items.1')}</li>
              <li>{t('sections.usage.items.2')}</li>
              <li>{t('sections.usage.items.3')}</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.account.title')}</h2>
            <p>{t('sections.account.body')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.ip.title')}</h2>
            <p>{t('sections.ip.body')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.disclaimer.title')}</h2>
            <p>{t('sections.disclaimer.body')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.termination.title')}</h2>
            <p>{t('sections.termination.body')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.contact.title')}</h2>
            <p>
              {t('sections.contact.body')}
              <br />
              {t('sections.contact.emailLabel')}{' '}
              <a href='mailto:contact@gekaixing.com' className='text-blue-500 hover:underline'>
                contact@gekaixing.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
