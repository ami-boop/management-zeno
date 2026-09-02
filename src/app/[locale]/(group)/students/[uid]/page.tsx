import { notFound, redirect } from 'next/navigation'
import Client from '@/components/student-detail/Client'
import { getSessionToken } from '@/utils/getSessionToken'
import { apiGet } from '@/lib/api/client'
import { parseManagementStudentDetail } from '@/lib/api-contracts'

export const dynamic = 'force-dynamic'

export default async function StudentDetailPage({ params }: { params: Promise<{ uid: string }> }) {
	const token = await getSessionToken()
	if (!token) redirect('/login')

	const { uid } = await params

	const data = await apiGet(`students/management/${uid}`, token).catch(() => null)
	const detail = data ? parseManagementStudentDetail(data) : null
	if (!detail) notFound()

	return <Client detail={detail} />
}
