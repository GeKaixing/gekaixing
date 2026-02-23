import Navbar from '@/components/gekaixing/Navbar'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export default async function PrivacyPage() {
  const t = await getTranslations('Legal.Privacy')

  return (
    <>
      <Navbar />
      <div className='container mx-auto p-4 md:p-8'>
        <div className='prose max-w-none'>
          <h1 className='mb-6 text-3xl font-bold'>{t('title')}</h1>
          <p className='mb-8 text-sm text-gray-500'>
            {t('updatedDateLabel')} {t('updatedDate')}
          </p>

          <p className='mb-4'>{t('intro')}</p>
          <hr className='my-8' />

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.collectedInfo.title')}</h2>
            <p className='mb-2'>{t('sections.collectedInfo.summary')}</p>
            <ul className='list-inside list-disc space-y-2'>
              <li>{t('sections.collectedInfo.items.0')}</li>
              <li>{t('sections.collectedInfo.items.1')}</li>
              <li>{t('sections.collectedInfo.items.2')}</li>
            </ul>
          </section>

          <hr className='my-8' />

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.usage.title')}</h2>
            <p className='mb-2'>{t('sections.usage.summary')}</p>
            <ul className='list-inside list-disc space-y-2'>
              <li>{t('sections.usage.items.0')}</li>
              <li>{t('sections.usage.items.1')}</li>
              <li>{t('sections.usage.items.2')}</li>
              <li>{t('sections.usage.items.3')}</li>
              <li>{t('sections.usage.items.4')}</li>
            </ul>
          </section>

          <hr className='my-8' />

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.sharing.title')}</h2>
            <p className='mb-2'>{t('sections.sharing.summary')}</p>
            <ul className='list-inside list-disc space-y-2'>
              <li>{t('sections.sharing.items.0')}</li>
              <li>{t('sections.sharing.items.1')}</li>
              <li>{t('sections.sharing.items.2')}</li>
            </ul>
          </section>

          <hr className='my-8' />

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.cookies.title')}</h2>
            <p className='mb-2'>{t('sections.cookies.body')}</p>
          </section>

          <hr className='my-8' />

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.security.title')}</h2>
            <p className='mb-2'>{t('sections.security.body')}</p>
          </section>

          <hr className='my-8' />

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.rights.title')}</h2>
            <p className='mb-2'>{t('sections.rights.body')}</p>
          </section>

          <hr className='my-8' />

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.contact.title')}</h2>
            <p>
              {t('sections.contact.body')}
              <br />
              {t('sections.contact.emailLabel')}{' '}
              <a href='mailto:privacy@gekaixing.com' className='text-blue-500 hover:underline'>
                privacy@gekaixing.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
