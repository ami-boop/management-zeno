'use server'

import getClassSchedule from './getClassSchedule'

/** Fetch megama schedule names in one round-trip (parallel fetches server-side). */
export default async function getMegamaNames(
	ids: string[]
): Promise<Record<string, string>> {
	const unique = [...new Set(ids)].filter(Boolean)
	if (unique.length === 0) return {}

	const entries = await Promise.all(
		unique.map(async id => {
			const res = await getClassSchedule(id)
			return [id, res.ok ? res.schedule.name : id] as const
		})
	)
	return Object.fromEntries(entries)
}
