import { redirect } from 'next/navigation'
import Client from '@/components/calendar/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseCalendarExceptions } from '@/lib/api-contracts'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	let exceptions = null
	try {
		exceptions = parseCalendarExceptions(await apiGet('calendar-exceptions', token))
	} catch {
		exceptions = null
	}

	return <Client initialExceptions={exceptions} />
}
