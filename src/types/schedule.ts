export type WeekDay = {
	name: string
	key: string
	shortName: string
}

export type Stop = {
	type: 'stop' | 'school'
	time: string
	label: string
	address?: string
	duration?: number
}
