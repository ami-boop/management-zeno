import Client from '@/components/friend-trips/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseFriendTrips, type FriendTripsData } from '@/lib/api-contracts'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function FriendTripsPage() {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	const data = await apiGet('friend-requests/management', token).catch(() => null)
	const initial: FriendTripsData | null = data ? parseFriendTrips(data) : null

	return <Client initial={initial} />
}
