import { screen, render } from '@testing-library/react'
import ScheduleGrid from '../ScheduleGrid'
import { lessons } from '@/mocks/tests'

jest.mock('../LessonCard', () => ({ lesson }: any) => <div data-testid='lesson-card'>{lesson.name}</div>)

describe('ScheduleGrid', () => {
  const getLessonTime = jest.fn()

  it('renders correctly', () => {
    render(<ScheduleGrid currentLessons={lessons} getLessonTime={getLessonTime} />)

    expect(screen.getAllByTestId('lesson-card')).toHaveLength(lessons.length)
  })
})
