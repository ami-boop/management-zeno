import { screen, render } from '@testing-library/react'
import Notice from '../Notice'

describe('ManagementReportNotice', () => {
  it('renders correctly', () => {
    render(<Notice />)

    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument()
    expect(screen.getByText('noticeMessage')).toBeInTheDocument()
  })
})
