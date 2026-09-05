import { notFound, redirect } from 'next/navigation'
import Client from '@/components/bus-detail/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseBusLive, type BusLiveTrip, type FleetBus } from '@/lib/api-contracts'

export const dynamic = 'force-dynamic'

export default async function BusDetailPage({ params }: { params: Promise<{ busId: string }> }) {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	const { busId } = await params

	const [busData, liveData] = await Promise.all([
		apiGet(`buses/${busId}`, token).catch(() => null),
		apiGet('dashboard/bus-live', token, { params: { busId } }).catch(() => null),
	])

	if (!busData || typeof busData !== 'object') notFound()
	const record = busData as Record<string, unknown>
	if (typeof record.busId !== 'string' || record.busId !== busId) notFound()
	const bus = record as unknown as FleetBus

	const live = parseBusLive(liveData)
	const trips: BusLiveTrip[] = live?.trips ?? []

	return <Client bus={bus} trips={trips} />
}
