import { screen, render } from '@testing-library/react'
import ManagementReportNotice from '../ManagementReportNotice'

describe('ManagementReportNotice', () => {
  it('renders correctly', () => {
    render(<ManagementReportNotice />)

    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument()
    expect(screen.getByText('noticeMessage')).toBeInTheDocument()
  })
})
