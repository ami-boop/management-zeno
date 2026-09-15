import type { StatisticsData } from '@/lib/api-contracts'

function esc(value: string | number): string {
	const s = String(value)
	return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function statisticsCsv(data: StatisticsData): string {
	const lines: string[] = []
	lines.push(['date', 'going', 'not_going', 'missing', 'attendance_rate', 'students', 'seats_ordered', 'trips'].join(','))
	for (const d of data.days) {
		lines.push([d.date, d.going, d.notGoing, d.missing, d.attendanceRate ?? '', d.students, d.seatsOrdered, d.trips].map(esc).join(','))
	}
	lines.push('')
	lines.push(['route_id', 'students', 'trips'].join(','))
	for (const r of data.routes) {
		lines.push([r.routeId, r.students, r.trips].map(esc).join(','))
	}
	lines.push('')
	lines.push(['stop_id', 'boardings'].join(','))
	for (const s of data.stops) {
		lines.push([s.stopId, s.boardings].map(esc).join(','))
	}
	return lines.join('\n')
}

export function downloadCsv(filename: string, content: string): void {
	const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = filename
	document.body.appendChild(link)
	link.click()
	link.remove()
	URL.revokeObjectURL(url)
}
