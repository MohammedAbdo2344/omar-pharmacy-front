import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'ar'];

export default getRequestConfig(async ({requestLocale}) => {
  // Validate that the incoming `locale` parameter is valid
  const requested = await requestLocale;
  const validLocale = requested && locales.includes(requested) ? requested : 'en';

  return {
    locale: validLocale,
    messages: (await import(`./language/${validLocale}.json`)).default
  };
});