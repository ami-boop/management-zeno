'use server'

import { ApiError, apiGet } from '@/lib/api/client'
import { parseRouteStops, type RouteStopsData } from '@/lib/api-contracts'
import { getSessionToken } from '@/utils/getSessionToken'

export type RouteStopsResult =
	| { ok: true; stops: RouteStopsData }
	| { ok: false; error: 'unauthorized' | 'not_found' | 'server_error' }

export default async function getRouteStops(routeId: string): Promise<RouteStopsResult> {
	const token = await getSessionToken()
	if (!token) return { ok: false, error: 'unauthorized' }

	try {
		const data = await apiGet('route-stops/management', token, {
			params: { routeId },
		})
		const stops = parseRouteStops(data)
		if (!stops) return { ok: false, error: 'not_found' }
		return { ok: true, stops }
	} catch (error) {
		if (error instanceof ApiError && error.status === 404) {
			return { ok: false, error: 'not_found' }
		}
		return { ok: false, error: 'server_error' }
	}
}
