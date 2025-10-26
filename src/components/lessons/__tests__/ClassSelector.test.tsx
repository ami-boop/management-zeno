import { screen, render } from '@testing-library/react'
import ClassSelector from '../ClassSelector'
import userEvent from '@testing-library/user-event'

describe('ClassSelector', () => {

  const grades = [
    { key: 'alef', label: 'א׳', hebrew: 'א׳' },
    { key: 'bet', label: 'ב׳', hebrew: 'ב׳' },
  ]
  const selectedGrade = 'alef'
  const setSelectedGrade = jest.fn()
  const selectedClass = '1'
  const setSelectedClass = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<ClassSelector grades={grades} selectedClass={selectedClass} setSelectedGrade={setSelectedGrade} selectedGrade={selectedGrade} setSelectedClass={setSelectedClass} />)

    expect(screen.getByText('selectGrade')).toBeInTheDocument()
    expect(screen.getAllByTestId('select-grade')).toHaveLength(grades.length)
    expect(screen.getAllByTestId('select-class')).toHaveLength(11)
  })

  it('styles applies correctly', () => {
    render(<ClassSelector grades={grades} selectedClass={selectedClass} setSelectedGrade={setSelectedGrade} selectedGrade={selectedGrade} setSelectedClass={setSelectedClass} />)
    const gradeButton = screen.getAllByTestId('select-grade')[0]
    const gradeButton2 = screen.getAllByTestId('select-grade')[1]
    const classButton = screen.getAllByTestId('select-class')[0]
    const classButton2 = screen.getAllByTestId('select-class')[1]

    expect(gradeButton).toHaveClass('bg-blue-50 text-blue-700 border-blue-200')
    expect(gradeButton2).toHaveClass('bg-white text-gray-700 border-gray-300 hover:bg-gray-50')
    expect(classButton).toHaveClass('bg-blue-50 text-blue-700 border-blue-200')
    expect(classButton2).toHaveClass('bg-white text-gray-700 border-gray-300 hover:bg-gray-50')

    expect(gradeButton).not.toHaveClass('bg-white text-gray-700 border-gray-300 hover:bg-gray-50')
    expect(classButton).not.toHaveClass('bg-white text-gray-700 border-gray-300 hover:bg-gray-50')
  })

  it('select grades button works correctly', async () => {
    const user = userEvent.setup()
    render(<ClassSelector grades={grades} selectedClass={selectedClass} setSelectedGrade={setSelectedGrade} selectedGrade={selectedGrade} setSelectedClass={setSelectedClass} />)
    const button = screen.getAllByTestId('select-grade')[0]

    await user.click(button)

    expect(setSelectedGrade).toHaveBeenCalledWith('alef')
    expect(setSelectedClass).toHaveBeenCalledWith('')
  })

  it('select class button works correctly', async () => {
    const user = userEvent.setup()
    render(<ClassSelector grades={grades} selectedClass={selectedClass} setSelectedGrade={setSelectedGrade} selectedGrade={selectedGrade} setSelectedClass={setSelectedClass} />)
    const button = screen.getAllByTestId('select-class')[0]

    await user.click(button)

    expect(setSelectedClass).toHaveBeenCalledWith('1')
  })
})
