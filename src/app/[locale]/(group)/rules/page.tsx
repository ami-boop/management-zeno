import { redirect } from 'next/navigation'
import Client from '@/components/rules/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseSettings } from '@/lib/api-contracts'

export const dynamic = 'force-dynamic'

export default async function RulesPage() {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	const raw = await apiGet('settings', token).catch(() => null)

	return <Client initial={parseSettings(raw)} />
}
