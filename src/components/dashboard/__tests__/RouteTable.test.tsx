import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RouteTable from '../RouteTable'
import { DashboardRoute } from '@/types/dashboard'
import { routes as mockRoutes } from '@/mocks/tests'

const mockGetStatusColor = (status: DashboardRoute['status']) => {
  const colors: Record<DashboardRoute['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    partial: 'bg-amber-50 text-amber-900 border-amber-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
  }
  return colors[status] || ''
}

const mockGetStatusDot = (status: DashboardRoute['status']) => {
  const dots: Record<DashboardRoute['status'], string> = {
    pending: 'bg-yellow-500',
    partial: 'bg-amber-500',
    completed: 'bg-gray-500',
  }
  return dots[status] || ''
}

const mockGetStatusText = (status: DashboardRoute['status']) => {
  return status
}

describe('RouteTable', () => {
  const mockOnOrderBuses = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders table with correct headers and route data', () => {
    render(
      <RouteTable
        routes={mockRoutes}
        onOrderBuses={mockOnOrderBuses}
        getStatusColor={mockGetStatusColor}
        getStatusDot={mockGetStatusDot}
        getStatusText={mockGetStatusText}
      />
    )

    // Check headers
    expect(screen.getByText('columns.route')).toBeInTheDocument()
    expect(screen.getByText('columns.goingByBus')).toBeInTheDocument()
    expect(screen.getByText('columns.notMarked')).toBeInTheDocument()
    expect(screen.getByText('columns.totalStudents')).toBeInTheDocument()
    expect(screen.getByText('columns.busesNeeded')).toBeInTheDocument()
    expect(screen.getByText('columns.status')).toBeInTheDocument()
    expect(screen.getByText('columns.actions')).toBeInTheDocument()

    // Check route data
    expect(screen.getByText('Route A')).toBeInTheDocument()
    expect(screen.getByText('Route B')).toBeInTheDocument()
    expect(screen.getByText('85')).toBeInTheDocument()
    expect(screen.getByText('60')).toBeInTheDocument()
    expect(screen.getByText('110')).toBeInTheDocument()
    expect(screen.getByText('75')).toBeInTheDocument()
  })

  test('calls onOrderBuses with correct parameters when +1 button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <RouteTable
        routes={mockRoutes}
        onOrderBuses={mockOnOrderBuses}
        getStatusColor={mockGetStatusColor}
        getStatusDot={mockGetStatusDot}
        getStatusText={mockGetStatusText}
      />
    )

    const plusOneButtons = screen.getAllByRole('button', { name: /\+1/i })
    await user.click(plusOneButtons[0])

    expect(mockOnOrderBuses).toHaveBeenCalledTimes(1)
    expect(mockOnOrderBuses).toHaveBeenCalledWith('A_12:00', 1)
  })

  test('calls onOrderBuses with remaining buses when "Order All" button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <RouteTable
        routes={mockRoutes}
        onOrderBuses={mockOnOrderBuses}
        getStatusColor={mockGetStatusColor}
        getStatusDot={mockGetStatusDot}
        getStatusText={mockGetStatusText}
      />
    )

    const orderAllButtons = screen.getAllByRole('button', { name: 'orderAll' })
    await user.click(orderAllButtons[1]) // Click on Route B's "Order All"

    expect(mockOnOrderBuses).toHaveBeenCalledTimes(1)
    expect(mockOnOrderBuses).toHaveBeenCalledWith('B_12:00', 2) // 3 needed - 1 ordered = 2
  })

  test('displays action buttons correctly based on buses ordered status', () => {
    const customRoutes: DashboardRoute[] = [
      { ...mockRoutes[0], busesOrdered: 4, busesNeeded: 4 }, // All ordered
      { ...mockRoutes[1], busesOrdered: 0, busesNeeded: 3 }, // None ordered
    ]

    render(
      <RouteTable
        routes={customRoutes}
        onOrderBuses={mockOnOrderBuses}
        getStatusColor={mockGetStatusColor}
        getStatusDot={mockGetStatusDot}
        getStatusText={mockGetStatusText}
      />
    )

    // First route should show "allOrdered"
    expect(screen.getByText('allOrdered')).toBeInTheDocument()

    // Second route should show both +1 and "Order All" buttons
    const plusOneButtons = screen.getAllByRole('button', { name: /\+1/i })
    const orderAllButtons = screen.getAllByRole('button', { name: 'orderAll' })

    expect(plusOneButtons).toHaveLength(1)
    expect(orderAllButtons).toHaveLength(1)
  })
})
