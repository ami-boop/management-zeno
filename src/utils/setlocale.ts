export function setLocaleCookie(locale: string) {
	const oneYear = 60 * 60 * 24 * 365
	document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${oneYear}`
}
