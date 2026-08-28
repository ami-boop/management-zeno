import { NextIntlClientProvider, hasLocale } from 'next-intl'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'
import '@/styles/globals.css'

const poppins = localFont({
  src: [
    { path: './fonts/poppins-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/poppins-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/poppins-700.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zeno',
  description: 'Zeno',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={poppins.className}>
        <ServiceWorkerRegistrar />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Toaster richColors position='top-right' />
      </body>
    </html>
  )
}
