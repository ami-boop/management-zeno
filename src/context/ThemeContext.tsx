'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export const THEME_COOKIE = 'zeno-theme'

export type ThemeSetting = 'system' | 'light' | 'dark'

function applyTheme(setting: ThemeSetting) {
	const root = document.documentElement
	const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
	const dark = setting === 'dark' || (setting === 'system' && systemDark)
	root.classList.toggle('dark', dark)
	root.classList.toggle('light', !dark)
}

export function resolveInitialSetting(): ThemeSetting {
	if (typeof document === 'undefined') return 'system'
	const match = document.cookie.match(/(?:^|; )zeno-theme=([^;]*)/)
	const value = match?.[1]
	return value === 'light' || value === 'dark' ? value : 'system'
}

const ThemeContext = createContext<{
	setting: ThemeSetting
	setTheme: (setting: ThemeSetting) => void
}>({ setting: 'system', setTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [setting, setSetting] = useState<ThemeSetting>('system')

	useEffect(() => {
		setSetting(resolveInitialSetting())
		const media = window.matchMedia('(prefers-color-scheme: dark)')
		const onChange = () => applyTheme(resolveInitialSetting())
		media.addEventListener('change', onChange)
		return () => media.removeEventListener('change', onChange)
	}, [])

	useEffect(() => {
		applyTheme(setting)
		document.cookie = `${THEME_COOKIE}=${setting};path=/;max-age=31536000;SameSite=Lax`
	}, [setting])

	const setTheme = useCallback((value: ThemeSetting) => setSetting(value), [])

	return <ThemeContext.Provider value={{ setting, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	return useContext(ThemeContext)
}

export function ThemeScript() {
	const script = `(function(){try{var r=document.documentElement,c=document.cookie.match(/(?:^|; )zeno-theme=([^;]*)/);var s=c&&c[1]==='light'?'light':c&&c[1]==='dark'?'dark':'system';var d=s==='dark'||(s!=='light'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);r.classList.toggle('dark',d);r.classList.toggle('light',!d);}catch(e){}})()`
	return <script dangerouslySetInnerHTML={{ __html: script }} />
}
