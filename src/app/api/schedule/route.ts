import { NextRequest, NextResponse } from 'next/server'
import type { Stop } from '@/types/schedule'

export async function POST(req: NextRequest) {
	const { routeId } = await req.json()
	// Моковые данные расписания
	const schedule = {
		morning: [
			{
				type: 'stop',
				time: '07:30',
				label: 'Main Street',
				address: '123 Main St',
				duration: 2,
			},
			{
				type: 'stop',
				time: '07:45',
				label: 'Central Park',
				address: '456 Park Ave',
				duration: 3,
			},
			{
				type: 'school',
				time: '08:00',
				label: 'Lincoln Elementary School',
				address: '100 School Drive',
			},
		] satisfies Stop[],
		afternoon: [
			{
				type: 'school',
				time: '15:30',
				label: 'Lincoln Elementary School',
				address: '100 School Drive',
			},
			{
				type: 'stop',
				time: '15:45',
				label: 'Central Park',
				address: '456 Park Ave',
				duration: 3,
			},
			{
				type: 'stop',
				time: '16:00',
				label: 'Main Street',
				address: '123 Main St',
			},
		] satisfies Stop[],
	}
	return NextResponse.json({ schedule })
}
