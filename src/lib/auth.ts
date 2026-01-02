import { cookies } from 'next/headers'
import { API_URL } from '@/constants'

export async function validateSession(): Promise<boolean> {
	try {
		const cookieStore = await cookies()
		const sessionCookie = cookieStore.get('managementSessionCookie')?.value

		if (!sessionCookie) {
			return false
		}

		const response = await fetch(`${API_URL}/auth/verify`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `sessionCookie=${sessionCookie}`,
			},
			cache: 'no-store',
		})

		return response.ok
	} catch {
		return false
	}
}

// export async function getSessionCookie(): Promise<string | undefined> {
// 	const cookieStore = await cookies()
// 	return cookieStore.get('managementSessionCookie')?.value
// }
