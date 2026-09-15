import type { CalendarExceptionType, ExceptionFormValues } from '@/lib/api-contracts'

export interface CalendarPreset {
	id: string
	labelKey: string
	type: CalendarExceptionType
	note: string | null
	overrideEndTimes?: Record<string, string> | null
	endTime?: string | null
	specialSchedule?: { scope: string[]; departureTime: string } | null
}

export const PRESETS: CalendarPreset[] = [
	{
		id: 'holiday',
		labelKey: 'presets.holiday',
		type: 'holiday',
		note: '',
	},
	{
		id: 'no_transport',
		labelKey: 'presets.noTransport',
		type: 'no_transport',
		note: '',
	},
	{
		id: 'exam',
		labelKey: 'presets.exam',
		type: 'exam_day',
		note: '',
	},
	{
		id: 'half_1200',
		labelKey: 'presets.half1200',
		type: 'half_day',
		note: '',
		endTime: '12:00',
	},
	{
		id: 'half_1300',
		labelKey: 'presets.half1300',
		type: 'half_day',
		note: '',
		endTime: '13:00',
	},
	{
		id: 'special_1330',
		labelKey: 'presets.special1330',
		type: 'special_schedule',
		note: '',
		specialSchedule: { scope: [], departureTime: '13:30' },
	},
	{
		id: 'special_1400',
		labelKey: 'presets.special1400',
		type: 'special_schedule',
		note: '',
		specialSchedule: { scope: [], departureTime: '14:00' },
	},
]

export function applyPreset(
	preset: CalendarPreset,
	overrides?: Partial<ExceptionFormValues>
): ExceptionFormValues {
	return {
		type: preset.type,
		note: preset.note,
		overrideEndTimes: preset.overrideEndTimes ?? null,
		specialSchedule: preset.specialSchedule ?? null,
		...overrides,
	}
}
