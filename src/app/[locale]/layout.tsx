import { NextIntlClientProvider, hasLocale } from 'next-intl'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from 'sonner'
import '@/styles/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
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
