import vectorsJson from '../vectors.json'
import { getIsraelOffsetMs, parseIsraelTime } from '../index'

type Vector = {
	utc: string
	date: string
	hhmm: string
	offsetHours: number
	dayIndex: number
	label: string
}

const { vectors } = vectorsJson as { vectors: Vector[] }

const wallOf = (ms: number): string => {
	const offMs = getIsraelOffsetMs(new Date(ms))
	return new Date(ms + offMs).toISOString().slice(0, 16)
}

describe('canonical time vectors', () => {
	it('copy matches frozen master: 16 vectors', () => {
		expect(vectors).toHaveLength(16)
	})

	for (const v of vectors) {
		it(`${v.label} (${v.utc})`, () => {
			const ms = Date.parse(v.utc)
			expect(Number.isNaN(ms)).toBe(false)
			expect(getIsraelOffsetMs(new Date(ms)) / 3600000).toBe(v.offsetHours)
			expect(wallOf(ms)).toBe(`${v.date}T${v.hhmm}`)

			const parsed = parseIsraelTime(v.date, v.hhmm).getTime()
			const naive = Date.parse(`${v.date}T${v.hhmm}:00Z`)
			if (v.label.includes('fold')) {
				expect(wallOf(parsed)).toBe(`${v.date}T${v.hhmm}`)
				expect(parsed).toBeLessThanOrEqual(ms)
				expect(ms - parsed).toBeLessThanOrEqual(3600000)
			} else {
				expect(parsed).toBe(ms)
				expect((naive - parsed) / 3600000).toBe(v.offsetHours)
			}
		})
	}
})
