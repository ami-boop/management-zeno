import { redirect } from 'next/navigation'
import Client from '@/components/calendar/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseCalendarExceptions } from '@/lib/api-contracts'
import getManagementStudents from '@/app/actions/getManagementStudents'

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

	// Hebrew labels come from the backend (single source of truth in classMap):
	// megama ids are valid keys in overrideEndTimes and special_schedule.scope,
	// class/parallel labels replace the client-side conversion.
	const studentMeta = await getManagementStudents({ limit: 1 })
	const megamas = (studentMeta.meta?.facets.megamas ?? [])
		.filter(entry => entry.id !== 'none')
		.map(entry => ({ id: entry.id, label: entry.label || entry.id }))
	const classLabels: Record<string, string> = Object.fromEntries(
		(studentMeta.meta?.facets.classes ?? [])
			.filter(entry => entry.id !== 'none')
			.map(entry => [entry.id, entry.label])
	)
	const parallelLabels: Record<string, string> = Object.fromEntries(
		(studentMeta.meta?.facets.parallels ?? [])
			.filter(entry => entry.id !== 'none')
			.map(entry => [entry.id, entry.label])
	)

	return (
		<Client
			initialExceptions={exceptions}
			megamas={megamas}
			classLabels={classLabels}
			parallelLabels={parallelLabels}
		/>
	)
}
