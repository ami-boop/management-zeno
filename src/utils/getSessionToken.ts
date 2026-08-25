import { headers } from 'next/headers'

export async function getSessionToken() {
	const header = (await headers()).get('authorization')
	if (!header) return undefined
	const [scheme, token] = header.split(' ')
	if (scheme?.toLowerCase() !== 'bearer' || !token) return undefined
	return token
}
