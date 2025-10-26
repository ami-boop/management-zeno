import { screen, render } from '@testing-library/react'
import { days, grades, times } from '@/mocks/tests'
import userEvent from '@testing-library/user-event'
import ScheduleViewerClient from '../ScheduleViewerClient'
import { getLessons } from '@/app/actions/getLessons'

jest.mock('../ClassSelector', () => ({
  __esModule: true,
  default: ({ setSelectedGrade, setSelectedClass }: any) => (
    <div>
      <button onClick={() => setSelectedGrade('10')}>Select Grade</button>
      <button onClick={() => setSelectedClass('A')}>Select Class</button>
    </div>
  ),
}))

jest.mock('../DayNavigation', () => ({
  __esModule: true,
  default: () => <div>Day Navigation</div>,
}))

jest.mock('../ScheduleGrid', () => ({
  __esModule: true,
  default: () => <div>Schedule Grid</div>,
}))

jest.mock('@/app/actions/getLessons', () => ({
  getLessons: jest.fn(),
}))


describe('ScheduleViewerClient', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initial render is correct', () => {
    render(<ScheduleViewerClient times={times} days={days} grades={grades} />)

    expect(screen.getByTestId('book-icon')).toBeInTheDocument()
    expect(screen.getByText('viewClassSchedule')).toBeInTheDocument()
    expect(screen.getByText('infoNotice')).toBeInTheDocument()
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })
  it('button renders correctly', () => {
    render(<ScheduleViewerClient times={times} days={days} grades={grades} />)
    const button = screen.getByRole('button', { name: 'viewSchedule' })

    expect(button).toBeDisabled()
    expect(button).toHaveClass('bg-gray-400 text-white cursor-not-allowed')
  })

  it('initial render is correct', () => {
    render(<ScheduleViewerClient times={times} days={days} grades={grades} />)

    expect(screen.getByTestId('book-icon')).toBeInTheDocument()
    expect(screen.getByText('viewClassSchedule')).toBeInTheDocument()
    expect(screen.getByText('Select Grade')).toBeInTheDocument()
    expect(screen.getByText('Select Class')).toBeInTheDocument()
    expect(screen.getByText('infoNotice')).toBeInTheDocument()
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })

  it('renders correct jsx after clicking the button', async () => {
    // Теперь mockResolvedValue будет работать
    (getLessons as jest.Mock).mockResolvedValue({
      ok: true,
      className: 'Class 10A',
      schedule: {
        sunday: [
          { lessonNumber: 1, subject: 'Math', teacher: 'Mr. Smith' },
        ],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
      },
    })

    const user = userEvent.setup()
    render(<ScheduleViewerClient times={times} days={days} grades={grades} />)

    // Выбираем класс и группу
    await user.click(screen.getByText('Select Grade'))
    await user.click(screen.getByText('Select Class'))

    // Кликаем на кнопку просмотра расписания
    const button = screen.getByRole('button', { name: 'viewSchedule' })
    await user.click(button)

    // Проверяем, что getLessons был вызван с правильными параметрами
    expect(getLessons).toHaveBeenCalledWith('10_A')
    expect(getLessons).toHaveBeenCalledTimes(1)

    // Ждем появления расписания
    expect(screen.getByText('Day Navigation')).toBeInTheDocument()
    expect(screen.getByText('Schedule Grid')).toBeInTheDocument()

    // Проверяем, что кнопка "назад" появилась
    expect(screen.getByText(/backToSelection/)).toBeInTheDocument()
  })

  it('renders error correctly', async () => {
    (getLessons as jest.Mock).mockResolvedValue(new Error('test error'))
    const user = userEvent.setup()
    render(<ScheduleViewerClient times={times} days={days} grades={grades} />)
    const button = screen.getByRole('button', { name: 'viewSchedule' })

    await user.click(screen.getByText('Select Grade'))
    await user.click(screen.getByText('Select Class'))
    await user.click(button)

    expect(screen.getByTestId('error')).toHaveTextContent('notFound')
  })
})
