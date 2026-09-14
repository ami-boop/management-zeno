import { redirect } from 'next/navigation'
import Client from '@/components/buses/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseBuses, parseBusLive, type BusLiveTrip } from '@/lib/api-contracts'

export const dynamic = 'force-dynamic'

export default async function BusesPage() {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	let buses = null
	let trips: BusLiveTrip[] = []
	const liveByBus: Record<string, { onRoute: boolean; routeName: string | null }> = {}
	try {
		const [busesValue, liveValue] = await Promise.all([
			apiGet('buses', token),
			apiGet('dashboard/bus-live', token).catch(() => null),
		])
		buses = parseBuses(busesValue)
		const live = parseBusLive(liveValue)
		if (live) {
			trips = live.trips
			for (const [busId, trip] of live.byBus) {
				liveByBus[busId] = { onRoute: trip.isOnRouteNow, routeName: trip.routeName }
			}
		}
	} catch {
		buses = null
	}

	return <Client initialBuses={buses} initialLiveByBus={liveByBus} initialTrips={trips} />
}
