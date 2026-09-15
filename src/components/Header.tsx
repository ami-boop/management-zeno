'use client'

import { useState } from 'react'
import { Bell, LogOut, MenuIcon, Monitor, Moon, Sun } from 'lucide-react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme, type ThemeSetting } from '@/context/ThemeContext'
import { setLocaleCookie } from '@/utils/setlocale'
import { locales } from '@/i18n/routing'
import { auth } from '@/lib/firebase'
import { waitForServiceWorkerSignOut } from '@/lib/service-worker'

export default function Header() {
  const locale = useLocale()
  const t = useTranslations('Header')
  const router = useRouter()
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (signingOut) return
    setSigningOut(true)
    try {
      await auth.signOut()
      // Wait until the service worker stops attaching the old token, so the
      // login redirect is not bounced back by a lingering session.
      await waitForServiceWorkerSignOut()
    } catch {
      // fall through: even on failure the client session is cleared
    } finally {
      setSigningOut(false)
      router.replace('/login')
    }
  }

  const localeLabel = (locale: string): string => {
    switch (locale) {
      case 'en':
        return 'English'
      case 'ru':
        return 'Русский'
      case 'he':
        return 'עברית'
      default:
        return locale
    }
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  const navLink = (href: string, label: string) => {
    const active = isActive(href)
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`group relative pb-1 text-sm font-medium transition-colors duration-200 ${
          active ? 'text-blue-700' : 'text-[#111518] hover:text-blue-700'
        }`}
      >
        {label}
        <span
          aria-hidden='true'
          className={`absolute bottom-0 start-0 h-0.5 w-full origin-start rounded-full bg-blue-600 transition-transform duration-300 ease-out ${
            active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-hover:bg-blue-300'
          }`}
        />
      </Link>
    )
  }

  const menuOptions = (dir: 'line' | 'col') => (
    <div
      className={`flex ${dir === 'col' ? 'flex-col' : 'items-center'} gap-9`}
    >
      {navLink('/dashboard', t('menu.dashboard'))}
      {navLink('/schedule', t('menu.schedule'))}
      {navLink('/routes', t('menu.routes'))}
      {navLink('/buses', t('menu.busses'))}
      {navLink('/students', t('menu.students'))}
      {navLink('/calendar', t('menu.calendar'))}
      {navLink('/friend-trips', t('menu.friendTrips'))}
      {navLink('/report', t('menu.report'))}
      {navLink('/statistics', t('menu.statistics'))}
      {dir === 'col' && (
        <>
          <Link className='text-sm font-medium text-[#111518]' href='/profile'>
            {t('menu.profile')}
          </Link>
          <Link className='text-sm font-medium text-[#111518]' href='/help'>
            {t('menu.help')}
          </Link>
          <button
            type='button'
            disabled={signingOut}
            onClick={() => void handleSignOut()}
            className='inline-flex items-center gap-2 text-sm font-medium text-red-600 disabled:opacity-50'
          >
            <LogOut className='h-4 w-4' />
            {t('signOut')}
          </button>
          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 flex pb-6'>
            {locales.map((locale, idx) => (
              <Link
                href='/dashboard'
                locale={locale}
                onClick={() => setLocaleCookie(locale)}
                key={locale}
                className={idx !== locales.length - 1 ? 'mr-9' : ''}
              >
                {localeLabel(locale)}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )

  const ToolButton = ({ children, label }: { children: React.ReactNode; label?: string }) => (
    <button
      aria-label={label}
      className='flex h-10 items-center justify-center rounded-full bg-[#f0f3f4] px-2.5 text-sm font-bold text-[#111518]'
    >
      {children}
    </button>
  )

  const ThemeToggle = () => {
    const { setting, setTheme } = useTheme()
    const options: { key: ThemeSetting; icon: React.ReactNode; label: string }[] = [
      { key: 'system', icon: <Monitor className='h-4 w-4' />, label: t('themeSystem') },
      { key: 'light', icon: <Sun className='h-4 w-4' />, label: t('themeLight') },
      { key: 'dark', icon: <Moon className='h-4 w-4' />, label: t('themeDark') },
    ]
    const activeIcon =
      setting === 'dark' ? <Moon className='h-4 w-4' /> : setting === 'light' ? <Sun className='h-4 w-4' /> : <Monitor className='h-4 w-4' />

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span>
            <ToolButton label={t('theme')}>{activeIcon}</ToolButton>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {options.map(option => (
            <DropdownMenuItem
              key={option.key}
              onClick={() => setTheme(option.key)}
              data-testid={`theme-${option.key}`}
              className={setting === option.key ? 'bg-accent' : ''}
            >
              <span className='flex items-center gap-2'>
                {option.icon}
                {option.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <header className='flex items-center justify-between border-b border-[#f0f3f4] bg-white px-10 py-3'>
      <div className='flex items-center gap-4 text-[#111518]'>
        <h2 className='text-lg font-bold tracking-[-0.015em] leading-tight'>
          <Link href='/dashboard'>Zeno</Link>
        </h2>
      </div>

      <div className='hidden md:flex flex-1 justify-end gap-8'>
        {menuOptions('line')}
        <div className='flex gap-4'>
          <ThemeToggle />
          <ToolButton label={t('notifications')}>
            <Link href='/notifications'>
              <Bell className='cursor-pointer' />
            </Link>
          </ToolButton>
          <button
            type='button'
            aria-label={t('signOut')}
            title={t('signOut')}
            disabled={signingOut}
            onClick={() => void handleSignOut()}
            className='flex h-10 items-center justify-center rounded-full bg-[#f0f3f4] px-2.5 text-sm font-bold text-[#111518] hover:opacity-80 disabled:opacity-50'
          >
            <LogOut className='h-4 w-4' />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger>{locale.toUpperCase()}</DropdownMenuTrigger>
            <DropdownMenuContent>
              {locales.map(locale => (
                <DropdownMenuItem key={locale}>
                  <Link
                    href='/dashboard'
                    locale={locale}
                    onClick={() => setLocaleCookie(locale)}
                  >
                    {localeLabel(locale)}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='md:hidden'>
        <Sheet>
          <SheetTrigger>
            <MenuIcon className='p-1 hover:opacity-30 rounded-lg' />
          </SheetTrigger>
          <SheetContent side='left' className='p-0'>
            <div className='flex flex-col h-full'>
              <SheetHeader className='p-4 border-b border-[#f0f3f4]'>
                <SheetTitle>{t('menu.title')}</SheetTitle>
              </SheetHeader>
              <div className='flex-1 flex items-center justify-center'>
                {menuOptions('col')}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
