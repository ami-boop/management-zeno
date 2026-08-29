import { redirect } from 'next/navigation'
import Client from '@/components/routes/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseRoutes } from '@/lib/api-contracts'

export const dynamic = 'force-dynamic'

export default async function RoutesPage() {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	let routes = null
	try {
		routes = parseRoutes(await apiGet('routes', token))
	} catch {
		routes = null
	}

	return <Client routes={routes} />
}
