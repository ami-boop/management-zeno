import { screen, render } from '@testing-library/react'
import ManagementReportStatus from '../ManagementReportStatus'

describe('ManagementReportStatus', () => {
  it('renders correctly', () => {
    render(<ManagementReportStatus />)

    expect(screen.getByText('currentTime')).toBeInTheDocument()
    expect(screen.getByText(/^([0-1]\d|2[0-3]):([0-5]\d)$/)).toBeInTheDocument()
    expect(screen.getByText('reportingAs')).toBeInTheDocument()
    expect(screen.getByText('Administrator')).toBeInTheDocument()
  })
})
