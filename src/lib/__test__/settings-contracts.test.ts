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
			autoCompleteRadiusM: 400,
			liveFreshnessMinutes: 3,
			autoCompleteFallbackMinutes: 30,
			atStopRadiusM: 500,
			lateDepartureGraceMin: 5,
			onTimeMin: -5,
			onTimeMax: 5,
			delaysCollectingMin: 10,
		})
		expect(parsed).toEqual({
			reportDeadlineMinutes: 60,
			reportTimes: ['15:35', '16:20'],
			vehicleCapacities: { bus: 50, minibus: 18 },
			minibusesEnabled: true,
			autoCompleteRadiusM: 400,
			liveFreshnessMinutes: 3,
			autoCompleteFallbackMinutes: 30,
			atStopRadiusM: 500,
			lateDepartureGraceMin: 5,
			onTimeMin: -5,
			onTimeMax: 5,
			delaysCollectingMin: 10,
		})
	})

	it('falls back to defaults', () => {
		expect(parseSettings({})).toEqual({
			reportDeadlineMinutes: 45,
			reportTimes: [],
			vehicleCapacities: { bus: 55, minibus: 20 },
			minibusesEnabled: false,
			autoCompleteRadiusM: 250,
			liveFreshnessMinutes: 5,
			autoCompleteFallbackMinutes: 20,
			atStopRadiusM: 300,
			lateDepartureGraceMin: 2,
			onTimeMin: -2,
			onTimeMax: 3,
			delaysCollectingMin: 7,
		})
	})

	it('falls back on garbage accuracy values', () => {
		const parsed = parseSettings({
			atStopRadiusM: 'far',
			lateDepartureGraceMin: -1,
			onTimeMin: 1.5,
			onTimeMax: null,
			delaysCollectingMin: NaN,
		})
		expect(parsed).toMatchObject({
			atStopRadiusM: 300,
			lateDepartureGraceMin: 2,
			onTimeMin: -2,
			onTimeMax: 3,
			delaysCollectingMin: 7,
		})
	})
})
