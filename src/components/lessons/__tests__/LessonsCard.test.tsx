import { screen, render } from '@testing-library/react'
import LessonCard from '../LessonCard'
import { lessons } from '@/mocks/tests'

describe('LessonCard', () => {

  const lesson = lessons[0]
  const index = 1
  const getLessonTime = jest.fn((index) => index && '12:00')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders lesson info correctly', () => {
    render(<LessonCard lesson={lesson} index={index} getLessonTime={getLessonTime} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('12:00')).toBeInTheDocument()
    expect(screen.getByTestId('color-div')).toHaveStyle('background-color: #ffffff')
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Math')
    expect(screen.getByText('Misha')).toBeInTheDocument()
    expect(screen.queryByText('noLessonScheduled')).not.toBeInTheDocument()
  })

  it('renders correctly if lesson not provided', () => {
    // @ts-expect-error to provide empty object as prop
    render(<LessonCard lesson={{}} index={index} getLessonTime={getLessonTime} />)

    expect(screen.getByTestId('card-container')).toHaveClass('opacity-50')
    expect(screen.queryByTestId('color-div')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('freePeriod')
    expect(screen.getByText('noLessonScheduled')).toBeInTheDocument()
  })
})
