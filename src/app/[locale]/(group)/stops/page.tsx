import { redirect } from 'next/navigation'
import Client from '@/components/stops/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseStops } from '@/lib/api-contracts'

export const dynamic = 'force-dynamic'

export default async function StopsPage() {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	let stops = null
	try {
		stops = parseStops(await apiGet('stops', token))
	} catch {
		stops = null
	}

	return <Client initialStops={stops} />
}
