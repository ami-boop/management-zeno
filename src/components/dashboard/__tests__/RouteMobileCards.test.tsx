import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RouteMobileCards from '../RouteMobileCards'
import { DashboardRoute } from '@/types/dashboard'
import { routes as mockRoutes } from '@/mocks/tests'

// Mock dayjs
jest.mock('dayjs', () => {
  return () => ({
    format: () => '10:30',
  })
})

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

describe('RouteMobileCards', () => {
  const mockOnOrderBuses = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders route information correctly', () => {
    render(
      <RouteMobileCards
        routes={mockRoutes}
        onOrderBuses={mockOnOrderBuses}
        getStatusColor={mockGetStatusColor}
        getStatusDot={mockGetStatusDot}
        getStatusText={mockGetStatusText}
      />
    )

    expect(screen.getByText('Route A')).toBeInTheDocument()
    expect(screen.getByText('Route B')).toBeInTheDocument()
    expect(screen.getByText('85')).toBeInTheDocument()
    expect(screen.getByText('60')).toBeInTheDocument()
    expect(screen.getByText('2/4')).toBeInTheDocument()
    expect(screen.getByText('1/3')).toBeInTheDocument()
  })

  test('calls onOrderBuses with correct parameters when +1 button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <RouteMobileCards
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
      <RouteMobileCards
        routes={mockRoutes}
        onOrderBuses={mockOnOrderBuses}
        getStatusColor={mockGetStatusColor}
        getStatusDot={mockGetStatusDot}
        getStatusText={mockGetStatusText}
      />
    )

    const orderAllButtons = screen.getAllByRole('button', { name: 'orderAll' })
    await user.click(orderAllButtons[0])

    expect(mockOnOrderBuses).toHaveBeenCalledTimes(1)
    expect(mockOnOrderBuses).toHaveBeenCalledWith('A_12:00', 2)
  })

  test('renders multiple routes and handles interactions independently', async () => {
    const user = userEvent.setup()

    render(
      <RouteMobileCards
        routes={mockRoutes}
        onOrderBuses={mockOnOrderBuses}
        getStatusColor={mockGetStatusColor}
        getStatusDot={mockGetStatusDot}
        getStatusText={mockGetStatusText}
      />
    )

    const routeContainers = screen.getAllByTestId('route-container')
    expect(routeContainers).toHaveLength(2)

    const plusOneButtons = screen.getAllByRole('button', { name: /\+1/i })
    await user.click(plusOneButtons[1]) // Click on Route B

    expect(mockOnOrderBuses).toHaveBeenCalledWith('B_12:00', 1)
  })
})
