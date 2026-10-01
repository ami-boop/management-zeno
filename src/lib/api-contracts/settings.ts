import { isNonNegativeNumber, isRecord, isString } from '@/utils/type-guards'

export interface SettingsData {
	reportDeadlineMinutes: number
	reportTimes: string[]
	vehicleCapacities: { bus: number; minibus: number }
	minibusesEnabled: boolean
	autoCompleteRadiusM: number
	liveFreshnessMinutes: number
	autoCompleteFallbackMinutes: number
	atStopRadiusM: number
	lateDepartureGraceMin: number
	onTimeMin: number
	onTimeMax: number
	delaysCollectingMin: number
}

function num(value: unknown, fallback: number): number {
	return isNonNegativeNumber(value) ? value : fallback
}

function signedInt(value: unknown, fallback: number): number {
	return typeof value === 'number' && Number.isInteger(value) ? value : fallback
}

export function parseSettings(value: unknown): SettingsData | null {
	if (!isRecord(value)) return null
	const capacities = isRecord(value.vehicleCapacities) ? value.vehicleCapacities : {}
	const times = Array.isArray(value.reportTimes) ? value.reportTimes.filter(isString) : []
	return {
		reportDeadlineMinutes: num(value.reportDeadlineMinutes, 45),
		reportTimes: [...new Set(times)].sort(),
		vehicleCapacities: {
			bus: num(capacities.bus, 55),
			minibus: num(capacities.minibus, 20),
		},
		minibusesEnabled: value.minibusesEnabled === true,
		autoCompleteRadiusM: num(value.autoCompleteRadiusM, 250),
		liveFreshnessMinutes: num(value.liveFreshnessMinutes, 5),
		autoCompleteFallbackMinutes: num(value.autoCompleteFallbackMinutes, 20),
		atStopRadiusM: num(value.atStopRadiusM, 300),
		lateDepartureGraceMin: num(value.lateDepartureGraceMin, 2),
		onTimeMin: signedInt(value.onTimeMin, -2),
		onTimeMax: signedInt(value.onTimeMax, 3),
		delaysCollectingMin: num(value.delaysCollectingMin, 7),
	}
}
