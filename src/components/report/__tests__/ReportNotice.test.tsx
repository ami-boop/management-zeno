import { screen, render } from '@testing-library/react'
import ReportNotice from '../ReportNotice'

describe('ManagementReportNotice', () => {
  it('renders correctly', () => {
    render(<ReportNotice />)

    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument()
    expect(screen.getByText('noticeMessage')).toBeInTheDocument()
  })
})
