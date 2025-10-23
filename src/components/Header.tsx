'use client'

import { Bell, MenuIcon } from 'lucide-react'
import { Link } from '@/i18n/navigation'
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
import { setLocaleCookie } from '@/utils/setlocale'

export default function Header() {
	const locale = useLocale()
	const locales = ['en', 'ru', 'he', 'ar']
	const t = useTranslations('Header')

	const localeLabel = (locale: string) => {
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

	const menuOptions = (dir: 'line' | 'col') => (
		<div
			className={`flex ${dir === 'col' ? 'flex-col' : 'items-center'} gap-9`}
		>
			<Link className='text-sm font-medium text-[#111518]' href='/dashboard'>
				{t('menu.dashboard')}
			</Link>
			<Link className='text-sm font-medium text-[#111518]' href='/schedule'>
				{t('menu.schedule')}
			</Link>
			<Link className='text-sm font-medium text-[#111518]' href='/routes'>
				{t('menu.routes')}
			</Link>
			<Link className='text-sm font-medium text-[#111518]' href='/students'>
				{t('menu.students')}
			</Link>
			<Link className='text-sm font-medium text-[#111518]' href='/report'>
				{t('menu.report')}
			</Link>
			<Link className='text-sm font-medium text-[#111518]' href='/lessons'>
				{t('menu.lessons')}
			</Link>
			{dir === 'col' && (
				<>
					<Link className='text-sm font-medium text-[#111518]' href='/profile'>
						{t('menu.profile')}
					</Link>
					<Link className='text-sm font-medium text-[#111518]' href='/help'>
						{t('menu.help')}
					</Link>
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

	const ToolButton = ({ children }: { children: React.ReactNode }) => (
		<button className='flex h-10 items-center justify-center rounded-full bg-[#f0f3f4] px-2.5 text-sm font-bold text-[#111518]'>
			{children}
		</button>
	)

	return (
		<header className='flex items-center justify-between border-b border-[#f0f3f4] px-10 py-3'>
			<div className='flex items-center gap-4 text-[#111518]'>
				<h2 className='text-lg font-bold tracking-[-0.015em] leading-tight'>
					<Link href='/dashboard'>Zeno</Link>
				</h2>
			</div>

			<div className='hidden md:flex flex-1 justify-end gap-8'>
				{menuOptions('line')}
				<div className='flex gap-4'>
					<ToolButton>
						<Link href='/notifications'>
							<Bell className='cursor-pointer' />
						</Link>
					</ToolButton>
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
