import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RouteTimeline from '../RouteTimeline'
import getRouteStops from '@/app/actions/getRouteStops'
import getClassSchedule from '@/app/actions/getClassSchedule'
import getCalendarException from '@/app/actions/getCalendarException'

jest.mock('@/app/actions/getRouteStops')
jest.mock('@/app/actions/getClassSchedule')
jest.mock('@/app/actions/getCalendarException')

jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) =>
		key.includes('.') ? key.split('.').pop() : key,
}))

const mockedGetRouteStops = jest.mocked(getRouteStops)
const mockedGetClassSchedule = jest.mocked(getClassSchedule)
const mockedGetCalendarException = jest.mocked(getCalendarException)

const classGroups = {
	classes: [{ id: 'yud_alef_1', label: 'י"א 1' }],
	megamasByParallel: [{ parallel: 'yud_alef', megamaIds: ['physics_adv'] }],
}
const megamaNames = { physics_adv: 'פיזיקה מוגבר' }
const routes = [{ id: 'route_B', name: 'Route B' }]
const today = { date: '2026-09-02', dayIndex: 3 }

describe('<RouteTimeline />', () => {
	beforeEach(() => {
		mockedGetRouteStops.mockResolvedValue({
			ok: true,
			stops: {
				routeId: 'route_B',
				name: 'Route B',
				stopsMorning: [
					{ stopId: 'stop_north', order: 1, durationMin: 0 },
					{ stopId: 'school_main', order: 2, durationMin: 30 },
				],
				stopsAfternoon: [
					{ stopId: 'school_main', order: 1, durationMin: 0 },
					{ stopId: 'stop_north', order: 2, durationMin: 10 },
					{ stopId: 'stop_south', order: 3, durationMin: 15 },
				],
			},
		})
		mockedGetClassSchedule.mockResolvedValue({
			ok: true,
			schedule: {
				id: 'yud_alef_1',
				type: 'base_class',
				name: 'י"א 1',
				endTimes: { '3': '15:35' },
			},
		})
		mockedGetCalendarException.mockResolvedValue({ ok: true, exception: null })
	})

	it('computes afternoon arrivals from class end time', async () => {
		const user = userEvent.setup()
		render(<RouteTimeline classGroups={classGroups} megamaNames={megamaNames} routes={routes} today={today} />)

		await user.selectOptions(screen.getByLabelText(/selectRoute/), 'route_B')
		await user.selectOptions(screen.getByLabelText(/selectClass/), 'yud_alef_1')

		await waitFor(() => {
			expect(mockedGetRouteStops).toHaveBeenCalledWith('route_B')
			expect(mockedGetClassSchedule).toHaveBeenCalledWith('yud_alef_1')
		})

		expect(screen.getAllByText('15:35').length).toBeGreaterThan(0)
		expect(screen.getAllByText('15:45').length).toBeGreaterThan(0)
		expect(screen.getAllByText('16:00').length).toBeGreaterThan(0)
	})

	it('uses exception departure time for today', async () => {
		mockedGetCalendarException.mockResolvedValue({
			ok: true,
			exception: {
				id: today.date,
				type: 'special_schedule',
				specialSchedule: { scope: ['yud_alef_1'], departureTime: '14:00' },
			},
		})
		const user = userEvent.setup()
		render(<RouteTimeline classGroups={classGroups} megamaNames={megamaNames} routes={routes} today={today} />)

		await user.selectOptions(screen.getByLabelText(/selectRoute/), 'route_B')
		await user.selectOptions(screen.getByLabelText(/selectClass/), 'yud_alef_1')

		await waitFor(() => {
			expect(screen.getAllByText('14:00').length).toBeGreaterThan(0)
			expect(screen.getAllByText('14:10').length).toBeGreaterThan(0)
		})
	})

	it('uses later of class and megama end times for departure', async () => {
		mockedGetClassSchedule.mockImplementation((async (id: string) =>
			id === 'physics_adv'
				? {
						ok: true as const,
						schedule: {
							id: 'physics_adv',
							type: 'megama' as const,
							name: 'פיזיקה מוגבר',
							endTimes: { '3': '16:20' },
						},
					}
				: {
						ok: true as const,
						schedule: {
							id: 'yud_alef_1',
							type: 'base_class' as const,
							name: 'י"א 1',
							endTimes: { '3': '15:35' },
						},
					}) as never)
		const user = userEvent.setup()
		render(<RouteTimeline classGroups={classGroups} megamaNames={megamaNames} routes={routes} today={today} />)

		await user.selectOptions(screen.getByLabelText(/selectRoute/), 'route_B')
		await user.selectOptions(screen.getByLabelText(/selectClass/), 'yud_alef_1')
		await user.selectOptions(screen.getByLabelText(/megamaOfParallel/), 'physics_adv')

		await waitFor(() => {
			expect(mockedGetClassSchedule).toHaveBeenCalledWith('physics_adv')
		})

		expect(screen.getAllByText('16:20').length).toBeGreaterThan(0)
		expect(screen.getAllByText('16:30').length).toBeGreaterThan(0)
	})

	it('shows morning offsets', async () => {
		const user = userEvent.setup()
		render(<RouteTimeline classGroups={classGroups} megamaNames={megamaNames} routes={routes} today={today} />)

		await user.selectOptions(screen.getByLabelText(/selectRoute/), 'route_B')

		await waitFor(() => {
			expect(screen.getAllByText(/\+0\b/).length).toBeGreaterThan(0)
			expect(screen.getAllByText(/\+30\b/).length).toBeGreaterThan(0)
		})
	})

	it('shows not-found for missing route', async () => {
		mockedGetRouteStops.mockResolvedValue({ ok: false, error: 'not_found' })
		const user = userEvent.setup()
		render(<RouteTimeline classGroups={classGroups} megamaNames={megamaNames} routes={routes} today={today} />)

		await user.selectOptions(screen.getByLabelText(/selectRoute/), 'route_B')

		await waitFor(() => {
			expect(screen.getByText('noSchedule')).toBeInTheDocument()
		})
	})
})
