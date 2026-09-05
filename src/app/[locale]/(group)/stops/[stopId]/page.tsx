import { notFound, redirect } from 'next/navigation'
import Client from '@/components/stop-detail/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseStopUsage } from '@/lib/api-contracts'

export const dynamic = 'force-dynamic'

export default async function StopDetailPage({ params }: { params: Promise<{ stopId: string }> }) {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	const { stopId } = await params

	const data = await apiGet(`stops/${stopId}/routes`, token).catch(() => null)
	const usage = data ? parseStopUsage(data) : null
	if (!usage) notFound()

	return <Client usage={usage} />
}
