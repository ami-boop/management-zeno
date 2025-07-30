'use server'

import { getSessionToken } from '@/utils/getSessionToken'

type data = {
	markAllAsRead?: boolean
	markAsReadId?: string
	clearAll?: boolean
	clearNotificationId?: string
}

export default async function setNotificationsAction(data: data) {
	const sessionCookie = await getSessionToken()

	await fetch('https://setnotifications-ag7er5qhga-ew.a.run.app', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Cookie: `managementSessionCookie=${sessionCookie}`,
		},
		body: JSON.stringify(data),
	}).then(async res => console.log(await res.json()))
}
