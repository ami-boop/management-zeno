import { parseSettings } from '@/lib/api-contracts/settings'

describe('parseSettings', () => {
	it('returns null for garbage', () => {
		expect(parseSettings(null)).toBeNull()
		expect(parseSettings([])).toBeNull()
	})

	it('parses full payload', () => {
		const parsed = parseSettings({
			reportDeadlineMinutes: 60,
			reportTimes: ['16:20', '15:35'],
			vehicleCapacities: { bus: 50, minibus: 18 },
			minibusesEnabled: true,
		})
		expect(parsed).toEqual({
			reportDeadlineMinutes: 60,
			reportTimes: ['15:35', '16:20'],
			vehicleCapacities: { bus: 50, minibus: 18 },
			minibusesEnabled: true,
		})
	})

	it('falls back to defaults', () => {
		expect(parseSettings({})).toEqual({
			reportDeadlineMinutes: 45,
			reportTimes: [],
			vehicleCapacities: { bus: 55, minibus: 20 },
			minibusesEnabled: false,
		})
	})
})
