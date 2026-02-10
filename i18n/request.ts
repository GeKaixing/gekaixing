import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

export default getRequestConfig(async ({locale}) => {
  const validLocales = ['en', 'zh-CN'];
  const validLocale = (validLocales.includes(locale as string) ? locale : 'en') as string;
  if (!validLocales.includes(validLocale)) notFound();

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});
