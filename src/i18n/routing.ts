import { defineRouting } from 'next-intl/routing'

export const locales = ['en', 'ru', 'he']

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en',
  localePrefix: 'always',
})
