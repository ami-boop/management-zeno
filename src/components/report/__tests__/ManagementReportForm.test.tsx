import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ManagementReportForm from '../ManagementReportForm'
import setStudentReturnStatus from '@/app/actions/setStudentsReturnStatus'

jest.mock('@/app/actions/setStudentsReturnStatus', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('../ManagementReportStatus', () => () => <div>ManagementReportStatus</div>)
jest.mock('../ManagementReportNotice', () => () => <div>ManagementReportNotice</div>)
jest.mock('../ManagementReportSuccess', () => ({ onReset }: any) => (
  <button onClick={onReset}>ManagementReportSuccess</button>
));

describe('ManagementReportForm', () => {
  const grades = [{ key: 'alef', hebrew: 'א׳' }, { key: 'yud', hebrew: 'י׳' }]
  const profiles = [{ key: 'cs', label: 'Computer Science' }, { key: 'cb', label: 'Chemistry Biology' }]
  const timeOptions = ['12:00', '12:45']
  const classNumbers = [1, 2, 3]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderComponent = () => {
    return render(
      <ManagementReportForm
        grades={grades}
        profiles={profiles}
        timeOptions={timeOptions}
        classNumbers={classNumbers}
      />
    )
  }

  it('renders correctly', () => {
    renderComponent()

    expect(screen.getByText('ManagementReportStatus')).toBeInTheDocument()
    expect(screen.getByText('ManagementReportNotice')).toBeInTheDocument()
    expect(screen.queryByText('ManagementReportSuccess')).not.toBeInTheDocument()
    expect(screen.getByText('parallelLabel')).toBeInTheDocument()
    expect(screen.getByText('selectParallel')).toBeInTheDocument()
    expect(screen.getAllByTestId('parallel-option')).toHaveLength(grades.length)
    expect(screen.getByText('gradeLabel')).toBeInTheDocument()
    expect(screen.queryAllByTestId('select-parallel')).toHaveLength(grades.length)
    expect(screen.queryByText('classLabel')).not.toBeInTheDocument()
    expect(screen.queryByText('profileLabel')).not.toBeInTheDocument()
    expect(screen.queryByText('timeLabel')).not.toBeInTheDocument()

    const submitButton = screen.getByRole('button', { name: 'reportButton' })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('has correct styling', () => {
    renderComponent()

    const selectParallelButtons = screen.getAllByTestId('select-parallel')
    selectParallelButtons.forEach(button => {
      expect(button).toHaveClass(
        'bg-white',
        'text-gray-700',
        'border-gray-300',
        'hover:bg-gray-50'
      )
    })
  })

  it('selects parallel and shows time options', async () => {
    const user = userEvent.setup()
    renderComponent()

    const parallelSelect = screen.getByRole('combobox')
    await user.selectOptions(parallelSelect, 'alef')

    expect(parallelSelect).toHaveValue('alef')
    expect(screen.queryByText('classLabel')).not.toBeInTheDocument()
    expect(screen.getByText('timeLabel')).toBeInTheDocument()
    expect(screen.getAllByTestId('select-time')).toHaveLength(timeOptions.length)
  })

  it('selects grade and shows class options', async () => {
    const user = userEvent.setup()
    renderComponent()

    const gradeButtons = screen.getAllByTestId('select-parallel')
    await user.click(gradeButtons[0]) // Click 'alef'

    expect(gradeButtons[0]).toHaveClass('bg-blue-50', 'text-blue-700', 'border-blue-200')
    expect(screen.getByText('classLabel')).toBeInTheDocument()
    expect(screen.queryByText('profileLabel')).not.toBeInTheDocument()
    expect(screen.queryByText('timeLabel')).not.toBeInTheDocument()
  })

  it('selects grade that does not need profile and shows time after class selection', async () => {
    const user = userEvent.setup()
    renderComponent()

    // Select grade 'alef' (doesn't need profile)
    const gradeButtons = screen.getAllByTestId('select-parallel')
    await user.click(gradeButtons[0])

    // Select class number
    const classButton = screen.getByRole('button', { name: /א׳1/ })
    await user.click(classButton)

    expect(screen.queryByText('profileLabel')).not.toBeInTheDocument()
    expect(screen.getByText('timeLabel')).toBeInTheDocument()
  })

  it('selects grade that needs profile and shows profile options', async () => {
    const user = userEvent.setup()
    renderComponent()

    // Select grade 'yud' (needs profile)
    const gradeButtons = screen.getAllByTestId('select-parallel')
    await user.click(gradeButtons[1])

    // Select class number
    const classButton = screen.getByRole('button', { name: /י׳1/ })
    await user.click(classButton)

    expect(screen.getByText('profileLabel')).toBeInTheDocument()
    expect(screen.getAllByTestId('select-profile')).toHaveLength(profiles.length)
    expect(screen.queryByText('timeLabel')).not.toBeInTheDocument()
  })

  it('selects profile and shows time options', async () => {
    const user = userEvent.setup()
    renderComponent()

    // Select grade that needs profile
    const gradeButtons = screen.getAllByTestId('select-parallel')
    await user.click(gradeButtons[1]) // yud

    // Select class
    const classButton = screen.getByRole('button', { name: /י׳1/ })
    await user.click(classButton)

    // Select profile
    const profileButtons = screen.getAllByTestId('select-profile')
    await user.click(profileButtons[0])

    expect(profileButtons[0]).toHaveClass('bg-blue-50', 'text-blue-700', 'border-blue-200')
    expect(screen.getByText('timeLabel')).toBeInTheDocument()
  })

  it('enables submit button when all required fields are selected for parallel', async () => {
    const user = userEvent.setup()
    renderComponent()

    const submitButton = screen.getByRole('button', { name: 'reportButton' })
    expect(submitButton).toBeDisabled()

    // Select parallel
    const parallelSelect = screen.getByRole('combobox')
    await user.selectOptions(parallelSelect, 'alef')

    expect(submitButton).toBeDisabled()

    // Select time
    const timeButtons = screen.getAllByTestId('select-time')
    await user.click(timeButtons[0])

    expect(submitButton).toBeEnabled()
  })

  it('enables submit button when all required fields are selected for individual class without profile', async () => {
    const user = userEvent.setup()
    renderComponent()

    const submitButton = screen.getByRole('button', { name: 'reportButton' })

    // Select grade (alef - no profile needed)
    const gradeButtons = screen.getAllByTestId('select-parallel')
    await user.click(gradeButtons[0])

    // Select class
    const classButton = screen.getByRole('button', { name: /א׳1/ })
    await user.click(classButton)

    // Select time
    const timeButtons = screen.getAllByTestId('select-time')
    await user.click(timeButtons[0])

    expect(submitButton).toBeEnabled()
  })

  it('enables submit button when all required fields are selected for individual class with profile', async () => {
    const user = userEvent.setup()
    renderComponent()

    const submitButton = screen.getByRole('button', { name: 'reportButton' })

    // Select grade (yud - needs profile)
    const gradeButtons = screen.getAllByTestId('select-parallel')
    await user.click(gradeButtons[1])

    expect(submitButton).toBeDisabled()

    // Select class
    const classButton = screen.getByRole('button', { name: /י׳1/ })
    await user.click(classButton)

    expect(submitButton).toBeDisabled()

    // Select profile
    const profileButtons = screen.getAllByTestId('select-profile')
    await user.click(profileButtons[0])

    expect(submitButton).toBeDisabled()

    // Select time
    const timeButtons = screen.getAllByTestId('select-time')
    await user.click(timeButtons[0])

    expect(submitButton).toBeEnabled()
  })

  it('resets individual selections when parallel is selected', async () => {
    const user = userEvent.setup()
    renderComponent()

    // First select individual class
    const gradeButtons = screen.getAllByTestId('select-parallel')
    await user.click(gradeButtons[1]) // yud

    const classButton = screen.getByRole('button', { name: /י׳1/ })
    await user.click(classButton)

    const profileButtons = screen.getAllByTestId('select-profile')
    await user.click(profileButtons[0])

    const timeButtons = screen.getAllByTestId('select-time')
    await user.click(timeButtons[0])

    // Now select parallel
    const parallelSelect = screen.getByRole('combobox')
    await user.selectOptions(parallelSelect, 'alef')

    // Individual selections should be hidden
    expect(screen.queryByText('classLabel')).not.toBeInTheDocument()
    expect(screen.queryByText('profileLabel')).not.toBeInTheDocument()

    // Time should still be visible but not selected
    expect(screen.getByText('timeLabel')).toBeInTheDocument()
    const newTimeButtons = screen.getAllByTestId('select-time')
    newTimeButtons.forEach(button => {
      expect(button).not.toHaveClass('bg-blue-50')
    })
  })

  it('submits form with parallel data', async () => {
    const user = userEvent.setup()
    const mockSetStudentReturnStatus = setStudentReturnStatus as jest.MockedFunction<typeof setStudentReturnStatus>
    mockSetStudentReturnStatus.mockResolvedValue({ success: true })

    renderComponent()

    // Select parallel
    const parallelSelect = screen.getByRole('combobox')
    await user.selectOptions(parallelSelect, 'alef')

    // Select time
    const timeButtons = screen.getAllByTestId('select-time')
    await user.click(timeButtons[0])

    // Submit
    const submitButton = screen.getByRole('button', { name: 'reportButton' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSetStudentReturnStatus).toHaveBeenCalledWith({
        parallel: 'alef',
        className: null,
        megama: null,
        time: '12:00'
      })
    })

    expect(screen.getByText('ManagementReportSuccess')).toBeInTheDocument()
  })

  it('submits form with individual class data without profile', async () => {
    const user = userEvent.setup()
    const mockSetStudentReturnStatus = setStudentReturnStatus as jest.MockedFunction<typeof setStudentReturnStatus>
    mockSetStudentReturnStatus.mockResolvedValue({ success: true })

    renderComponent()

    // Select grade
    const gradeButtons = screen.getAllByTestId('select-parallel')
    await user.click(gradeButtons[0]) // alef

    // Select class
    const classButton = screen.getByRole('button', { name: /א׳1/ })
    await user.click(classButton)

    // Select time
    const timeButtons = screen.getAllByTestId('select-time')
    await user.click(timeButtons[1])

    // Submit
    const submitButton = screen.getByRole('button', { name: 'reportButton' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSetStudentReturnStatus).toHaveBeenCalledWith({
        parallel: null,
        className: 'alef_1',
        megama: null,
        time: '12:45'
      })
    })
  })

  it('submits form with individual class data with profile', async () => {
    const user = userEvent.setup()
    const mockSetStudentReturnStatus = setStudentReturnStatus as jest.MockedFunction<typeof setStudentReturnStatus>
    mockSetStudentReturnStatus.mockResolvedValue({ success: true })

    renderComponent()

    // Select grade
    const gradeButtons = screen.getAllByTestId('select-parallel')
    await user.click(gradeButtons[1]) // yud

    // Select class
    const classButton = screen.getByRole('button', { name: /י׳2/ })
    await user.click(classButton)

    // Select profile
    const profileButtons = screen.getAllByTestId('select-profile')
    await user.click(profileButtons[1]) // cb

    // Select time
    const timeButtons = screen.getAllByTestId('select-time')
    await user.click(timeButtons[0])

    // Submit
    const submitButton = screen.getByRole('button', { name: 'reportButton' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSetStudentReturnStatus).toHaveBeenCalledWith({
        parallel: null,
        className: 'yud_2',
        megama: 'cb',
        time: '12:00'
      })
    })
  })

  it('resets form after successful submission', async () => {
    const user = userEvent.setup()
    const mockSetStudentReturnStatus = setStudentReturnStatus as jest.MockedFunction<typeof setStudentReturnStatus>
    mockSetStudentReturnStatus.mockResolvedValue({ success: true })

    renderComponent()

    // Complete form
    const parallelSelect = screen.getByRole('combobox')
    await user.selectOptions(parallelSelect, 'alef')

    const timeButtons = screen.getAllByTestId('select-time')
    await user.click(timeButtons[0])

    const submitButton = screen.getByRole('button', { name: 'reportButton' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('ManagementReportSuccess')).toBeInTheDocument()
    })

    // Click reset
    const resetButton = screen.getByText('ManagementReportSuccess')
    await user.click(resetButton)

    // Should be back to initial state
    expect(screen.queryByText('ManagementReportSuccess')).not.toBeInTheDocument()
    expect(screen.getByText('gradeLabel')).toBeInTheDocument()
    expect(screen.queryByText('timeLabel')).not.toBeInTheDocument()
  })

  it('changes selection when different grade is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()

    const gradeButtons = screen.getAllByTestId('select-parallel')

    // Select first grade
    await user.click(gradeButtons[0])
    expect(gradeButtons[0]).toHaveClass('bg-blue-50')
    expect(gradeButtons[1]).not.toHaveClass('bg-blue-50')

    // Select second grade
    await user.click(gradeButtons[1])
    expect(gradeButtons[0]).not.toHaveClass('bg-blue-50')
    expect(gradeButtons[1]).toHaveClass('bg-blue-50')
  })

  it('selects "all profiles" option', async () => {
    const user = userEvent.setup()
    renderComponent()

    // Select grade that needs profile
    const gradeButtons = screen.getAllByTestId('select-parallel')
    await user.click(gradeButtons[1]) // yud

    // Select class
    const classButton = screen.getByRole('button', { name: /י׳1/ })
    await user.click(classButton)

    // Select "all profiles"
    const allProfilesButton = screen.getByRole('button', { name: 'selectAllProfiles' })
    await user.click(allProfilesButton)

    expect(allProfilesButton).toHaveClass('bg-blue-50', 'text-blue-700')
    expect(screen.getByText('timeLabel')).toBeInTheDocument()
  })
})
