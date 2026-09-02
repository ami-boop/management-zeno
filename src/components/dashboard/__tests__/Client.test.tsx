import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Client from '../Client'
import setTripBuses from '@/app/actions/setTripBuses'
import { routes as mockRoutes } from '@/mocks/tests'
import { DashboardResponse } from '@/lib/api-contracts'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}))

jest.mock('../Header', () => (props: any) => (
  <div data-testid="header">{props.lastUpdated}</div>
))
jest.mock('../Stats', () => ({ stats }: any) => (
  <div data-testid="stats">{JSON.stringify(stats)}</div>
))
jest.mock('../RouteFilters', () => ({
  __esModule: true,
  default: ({ setSelectedFilter }: any) => (
    <div>
      <button data-testid="filter-completed" onClick={() => setSelectedFilter('completed')}>
        Filter Completed
      </button>
    </div>
  ),
}))
jest.mock('../RouteTable', () => ({
  __esModule: true,
  default: ({ routes, onOrderBuses }: any) => (
    <div>
      <div data-testid="route-table">{routes.map((r: any) => r.id).join(',')}</div>
      <button data-testid="order-bus" onClick={() => onOrderBuses(routes[0].id, 1)}>
        +1
      </button>
    </div>
  ),
}))
jest.mock('../RouteMobileCards', () => ({
  __esModule: true,
  default: () => <div data-testid="mobile-cards" />,
}))
jest.mock('@/app/actions/setTripBuses', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const data: DashboardResponse = {
  trips: mockRoutes.map((r) => ({
    tripId: r.id,
    routeId: r.id,
    scheduledTime: r.estimatedTime,
    scheduledAt: null,
    status:
      r.status === 'completed'
        ? 'completed'
        : r.status === 'partial'
          ? 'in_transit'
          : 'scheduled',
    busId: null,
    driverUid: null,
    metrics: { totalStudents: r.totalStudents, busesNeeded: r.busesNeeded, minibusesNeeded: 0 },
    autoBusesNeeded: r.busesNeeded,
    autoMinibusesNeeded: 0,
    assignedBuses: r.status === 'completed' ? r.busesNeeded : r.status === 'partial' ? 1 : null,
    assignedMinibuses: null,
    pendingFriendCount: 0,
    capacityAvailable: 0,
  })),
  totals: null,
  capacities: null,
}

describe('<Client />', () => {
  it('renders header, stats and a table with all routes', () => {
    render(<Client data={data} routeNameMap={{}} />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('stats')).toBeInTheDocument()
    expect(screen.getByTestId('route-table')).toHaveTextContent(
      mockRoutes.map((r) => r.id).join(',')
    )
    expect(screen.getByTestId('mobile-cards')).toBeInTheDocument()
  })

  it('filters trips by completed status', async () => {
    const user = userEvent.setup()
    render(<Client data={data} routeNameMap={{}} />)

    await user.click(screen.getByTestId('filter-completed'))

    await waitFor(() => {
      expect(screen.getByTestId('route-table')).toHaveTextContent(
        mockRoutes.filter((r) => r.status === 'completed').map((r) => r.id).join(',')
      )
    })
  })

  it('orders a bus through setTripBuses', async () => {
    const user = userEvent.setup()
    render(<Client data={data} routeNameMap={{}} />)

    await user.click(screen.getByTestId('order-bus'))

    await waitFor(() => {
      expect(setTripBuses).toHaveBeenCalledWith(
        mockRoutes[0].id,
        { buses: 4 }
      )
    })
  })
})
