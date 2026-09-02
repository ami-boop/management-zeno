import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClassEndTimes from '../ClassEndTimes'
import getClassSchedule from '@/app/actions/getClassSchedule'
import getCalendarException from '@/app/actions/getCalendarException'

jest.mock('@/app/actions/getClassSchedule')
jest.mock('@/app/actions/getCalendarException')

jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) =>
		key.includes('.') ? key.split('.').pop() : key,
}))

const mockedGetClassSchedule = jest.mocked(getClassSchedule)
const mockedGetCalendarException = jest.mocked(getCalendarException)

const classes = [
	{ id: 'yud_alef_1', label: 'י"א 1' },
	{ id: 'bio_adv', label: 'ביולוגיה מוגבר' },
]

const today = { date: '2026-09-02', dayIndex: 3 }

describe('<ClassEndTimes />', () => {
	beforeEach(() => {
		mockedGetClassSchedule.mockResolvedValue({
			ok: true,
			schedule: {
				id: 'yud_alef_1',
				type: 'base_class',
				name: 'י"א 1',
				endTimes: { '0': '15:35', '2': '13:15', '3': '15:35' },
			},
		})
		mockedGetCalendarException.mockResolvedValue({ ok: true, exception: null })
	})

	it('loads schedule and shows day rows for a selected class', async () => {
		const user = userEvent.setup()
		render(<ClassEndTimes classes={classes} today={today} />)

		await user.selectOptions(screen.getByLabelText(/selectClass/), 'yud_alef_1')

		await waitFor(() => {
			expect(mockedGetClassSchedule).toHaveBeenCalledWith('yud_alef_1')
			expect(screen.getAllByText('15:35').length).toBeGreaterThan(0)
			expect(screen.getAllByText('13:15').length).toBeGreaterThan(0)
		})
	})

	it('shows holiday exception alert and noSchool for today', async () => {
		mockedGetCalendarException.mockResolvedValue({
			ok: true,
			exception: { id: today.date, type: 'holiday', note: 'Rosh Hashanah' },
		})
		const user = userEvent.setup()
		render(<ClassEndTimes classes={classes} today={today} />)

		await user.selectOptions(screen.getByLabelText(/selectClass/), 'yud_alef_1')

		await waitFor(() => {
			expect(mockedGetCalendarException).toHaveBeenCalledWith(today.date)
			expect(screen.getByText(/exceptionHoliday/)).toBeInTheDocument()
			expect(screen.getAllByText(/noSchool/).length).toBeGreaterThan(0)
		})
	})

	it('shows not-found message when class has no schedule', async () => {
		mockedGetClassSchedule.mockResolvedValue({ ok: false, error: 'not_found' })
		const user = userEvent.setup()
		render(<ClassEndTimes classes={classes} today={today} />)

		await user.selectOptions(screen.getByLabelText(/selectClass/), 'bio_adv')

		await waitFor(() => {
			expect(screen.getByText('noSchedule')).toBeInTheDocument()
		})
	})
})
