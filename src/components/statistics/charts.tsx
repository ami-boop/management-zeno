'use client'

import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import type { RouteStat, StatsDay, TripStat } from '@/lib/api-contracts'

const SAGE = 'var(--zeno-sage)'
const AMBER = 'var(--zeno-amber)'
const DANGER = 'var(--zeno-danger)'
const INK = 'var(--zeno-ink)'
const MUTED = 'var(--zeno-muted)'
const LINE = 'var(--zeno-line)'

function shortDate(iso: string): string {
	return iso.length >= 10 ? iso.slice(5) : iso
}

function ChartTip({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number | string; payload?: Record<string, unknown> }>; label?: string }) {
	if (!active || !payload || payload.length === 0) return null
	return (
		<div className='rounded-xl border border-zeno-line bg-zeno-surface px-3 py-2 text-xs shadow-zeno-card'>
			{label && <div className='mb-1 font-bold text-zeno-ink tabular-nums'>{label}</div>}
			{payload.map((entry, i) => (
				<div key={i} className='flex items-center justify-between gap-4 text-zeno-ink-soft tabular-nums'>
					<span>{entry.name}</span>
					<span className='font-bold text-zeno-ink'>{entry.payload?.unknownFill ? '—' : entry.value}</span>
				</div>
			))}
		</div>
	)
}

const axisTick = { fontSize: 11, fill: MUTED }

export function LoadBars({ days, studentsLabel, seatsLabel, isRTL }: { days: StatsDay[]; studentsLabel: string; seatsLabel: string; isRTL: boolean }) {
	const data = days.map(d => ({ date: shortDate(d.date), [studentsLabel]: d.students, [seatsLabel]: d.seatsOrdered }))
	return (
		<ResponsiveContainer width='100%' height={260}>
			<BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }} barGap={3}>
				<CartesianGrid stroke={LINE} vertical={false} />
				<XAxis dataKey='date' tick={axisTick} tickLine={false} axisLine={{ stroke: LINE }} reversed={isRTL} interval={Math.max(0, Math.ceil(data.length / 10) - 1)} />
				<YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
				<Tooltip content={<ChartTip />} cursor={{ fill: 'var(--zeno-paper-soft)' }} />
				<Bar dataKey={studentsLabel} fill={SAGE} radius={[4, 4, 0, 0]} maxBarSize={22} />
				<Bar dataKey={seatsLabel} fill={AMBER} radius={[4, 4, 0, 0]} maxBarSize={22} />
			</BarChart>
		</ResponsiveContainer>
	)
}

export function AttendanceTrend({ days, rateLabel, isRTL }: { days: StatsDay[]; rateLabel: string; isRTL: boolean }) {
	const data = days.map(d => ({
		date: shortDate(d.date),
		[rateLabel]: d.attendanceRate === null ? null : Math.round(d.attendanceRate * 1000) / 10,
	}))
	return (
		<ResponsiveContainer width='100%' height={260}>
			<AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
				<CartesianGrid stroke={LINE} vertical={false} />
				<XAxis dataKey='date' tick={axisTick} tickLine={false} axisLine={{ stroke: LINE }} reversed={isRTL} interval={Math.max(0, Math.ceil(data.length / 10) - 1)} />
				<YAxis tick={axisTick} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
				<Tooltip content={<ChartTip />} cursor={{ stroke: LINE }} />
				<Area type='monotone' dataKey={rateLabel} stroke={SAGE} strokeWidth={2.5} fill={SAGE} fillOpacity={0.15} connectNulls />
			</AreaChart>
		</ResponsiveContainer>
	)
}

function fillColor(fill: number | null): string {
	if (fill === null) return MUTED
	if (fill > 1) return DANGER
	if (fill >= 0.85) return AMBER
	return SAGE
}

export function TripFillBars({ trips, isRTL }: { trips: TripStat[]; isRTL: boolean }) {
	const data = trips.map(t => ({
		name: `${t.routeId} · ${t.scheduledTime}`,
		fill: t.fillRate === null ? 0 : Math.round(t.fillRate * 100),
		unknownFill: t.fillRate === null,
		color: fillColor(t.fillRate),
		students: t.students,
		seats: t.seats,
	}))
	return (
		<ResponsiveContainer width='100%' height={Math.max(120, data.length * 30 + 30)}>
			<BarChart data={data} layout='vertical' margin={{ top: 4, right: 12, bottom: 0, left: 8 }}>
				<CartesianGrid stroke={LINE} horizontal={false} />
				<XAxis type='number' tick={axisTick} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} reversed={isRTL} />
				<YAxis type='category' dataKey='name' tick={axisTick} tickLine={false} axisLine={false} width={120} />
				<Tooltip content={<ChartTip />} cursor={{ fill: 'var(--zeno-paper-soft)' }} />
				<Bar dataKey='fill' maxBarSize={16} radius={[0, 4, 4, 0]}>
					{data.map((entry, i) => (
						<Cell key={i} fill={entry.color} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	)
}

export function RouteBars({ routes, isRTL }: { routes: RouteStat[]; isRTL: boolean }) {
	const data = routes.slice(0, 15).map(r => ({ name: r.routeId || '—', students: r.students }))
	return (
		<ResponsiveContainer width='100%' height={Math.max(120, data.length * 30 + 30)}>
			<BarChart data={data} layout='vertical' margin={{ top: 4, right: 12, bottom: 0, left: 8 }}>
				<CartesianGrid stroke={LINE} horizontal={false} />
				<XAxis type='number' tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} reversed={isRTL} />
				<YAxis type='category' dataKey='name' tick={{ ...axisTick, fill: INK, fontWeight: 600 }} tickLine={false} axisLine={false} width={90} />
				<Tooltip content={<ChartTip />} cursor={{ fill: 'var(--zeno-paper-soft)' }} />
				<Bar dataKey='students' fill={SAGE} maxBarSize={16} radius={[0, 4, 4, 0]} />
			</BarChart>
		</ResponsiveContainer>
	)
}
