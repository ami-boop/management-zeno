import { screen, render } from '@testing-library/react'
import DayNavigation from '../DayNavigation'
import userEvent from '@testing-library/user-event'
import { days } from '@/mocks/tests'

describe('DayNavigation', () => {
  let selectedDay = 'monday'
  const setSelectedDay = jest.fn((key) => selectedDay = key)

  it('renders correctly', () => {
    render(<DayNavigation days={days} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />)

    expect(screen.getAllByRole('button')).toHaveLength(days.length)
    expect(screen.getByText('days.monday')).toBeInTheDocument()
    expect(screen.getByText('days.sunday')).toBeInTheDocument()
  })
  it('styles applies correctly', () => {
    render(<DayNavigation days={days} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />)
    const mondayButton = screen.getByTestId('day-monday')
    const sundayButton = screen.getByTestId('day-sunday')

    expect(mondayButton).toHaveClass('bg-blue-600 text-white')
    expect(sundayButton).toHaveClass('bg-white text-gray-700 border border-gray-300 hover:bg-gray-50')
  })
  it('changes selected day correctly', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <DayNavigation days={days} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
    )
    const sundayButton = screen.getByTestId('day-sunday')

    await user.click(sundayButton)

    // Проверяем, что колбэк вызван с правильным аргументом
    expect(setSelectedDay).toHaveBeenCalledWith('sunday')

    // Меняем значение и ререндерим, чтобы стили обновились
    selectedDay = 'sunday'
    rerender(<DayNavigation days={days} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />)

    const mondayButton = screen.getByTestId('day-monday')

    expect(sundayButton).toHaveClass('bg-blue-600 text-white')
    expect(mondayButton).not.toHaveClass('bg-blue-600 text-white')
  })
})
