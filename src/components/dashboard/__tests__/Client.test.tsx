import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Client from '../Client'
import dayjs from 'dayjs'
import addBus from '@/app/actions/addBus'
import { routes as mockRoutes } from '@/mocks/tests'

// ✅ Моки зависимостей
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
      <button data-testid="order-bus" onClick={() => onOrderBuses('A_12:00', 1)}>
        Order Bus
      </button>
    </div>
  ),
}))
jest.mock('../RouteMobileCards', () => () => (
  <div data-testid="mobile-cards">MobileCards</div>
))

jest.mock('@/app/actions/addBus', () => jest.fn())

describe('<Client />', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders basic components (Header, Stats, RouteTable)', () => {
    render(<Client routes={mockRoutes} />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('stats')).toBeInTheDocument()
    expect(screen.getByTestId('route-table')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-cards')).toBeInTheDocument()
  })

  it('passes right lastUpdate information Header', () => {
    render(<Client routes={mockRoutes} />)

    const latestUnix = Math.max(...mockRoutes.map(r => r.lastUpdate._seconds))
    const expectedDate = dayjs.unix(latestUnix).format('YYYY-MM-DD HH:mm:ss')

    expect(screen.getByTestId('header')).toHaveTextContent(expectedDate)
  })

  it('filter "completed" works correctly', async () => {
    const user = userEvent.setup()
    render(<Client routes={mockRoutes} />)

    await user.click(screen.getByTestId('filter-completed'))

    await waitFor(() => {
      const table = screen.getByTestId('route-table')
      expect(table).toHaveTextContent('A_12:00')
      expect(table).not.toHaveTextContent('B_12:00')
    })
  })

  it('calls addBus when requesting a bus', async () => {
    const user = userEvent.setup()
    render(<Client routes={mockRoutes} />)

    await user.click(screen.getByTestId('order-bus'))

    await waitFor(() => {
      expect(addBus).toHaveBeenCalledTimes(1)
      expect(addBus).toHaveBeenCalledWith('A_12:00', 1)
    })
  })
})
