import { screen, render } from '@testing-library/react'
import ManagementReportSuccess from '../ManagementReportSuccess'
import userEvent from '@testing-library/user-event'

describe('ManagementReportSuccess', () => {
  const onReset = jest.fn()

  beforeEach(() => {
    render(<ManagementReportSuccess onReset={onReset} />)
  })

  it('renders correctly', () => {
    expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls reset on button click', async () => {
    const user = userEvent.setup()
    const button = screen.getByRole('button')

    await user.click(button)
    expect(onReset).toHaveBeenCalled()
  })
})
