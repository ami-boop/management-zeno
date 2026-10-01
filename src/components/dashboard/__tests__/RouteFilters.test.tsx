import { render, screen } from '@testing-library/react';
import RouteFilters from '../RouteFilters';
import userEvent from '@testing-library/user-event';

const mockFilterButtons = [
  { key: 'all', label: 'All Routes', count: 5 },
  { key: 'pending', label: 'Pending Orders', count: 2 },
  { key: 'partial', label: 'Partially Ordered', count: 1 },
  { key: 'completed', label: 'Fully Ordered', count: 2 },
];

const mockRouteFilterButtons = [
  { key: 'all', label: 'All Routes', count: 5 },
  { key: 'route1', label: 'Route 1', count: 3 },
  { key: 'route2', label: 'Route 2', count: 2 },
];

const mockSetSelectedFilter = jest.fn();
const mockSetSelectedRoute = jest.fn();
const mockSetSearchQuery = jest.fn();
const mockSetLateFirst = jest.fn();

describe('RouteFilters', () => {
  it('renders correctly', () => {
    render(
      <RouteFilters
        filterButtons={mockFilterButtons}
        selectedFilter="all"
        setSelectedFilter={mockSetSelectedFilter}
        routeFilterButtons={mockRouteFilterButtons}
        selectedRoute="route1"
        setSelectedRoute={mockSetSelectedRoute}
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        lateFirst={false}
        setLateFirst={mockSetLateFirst}
      />
    )

    expect(screen.getByPlaceholderText('searchPlaceholder')).toBeInTheDocument()
    expect(screen.getAllByTestId(/filter-selector/)).toHaveLength(mockFilterButtons.length)
    expect(screen.getByTestId('filter-selector-all')).toHaveClass('bg-blue-100 text-blue-800 border border-blue-200')
    expect(screen.getAllByTestId(/route-filter-button/)).toHaveLength(mockRouteFilterButtons.length)
    expect(screen.getByTestId('route-filter-button-route1')).toHaveClass('bg-emerald-100 text-emerald-800 border border-emerald-200')
  })

  it('changes filter correctly', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <RouteFilters
        filterButtons={mockFilterButtons}
        selectedFilter="all"
        setSelectedFilter={mockSetSelectedFilter}
        routeFilterButtons={mockRouteFilterButtons}
        selectedRoute="route1"
        setSelectedRoute={mockSetSelectedRoute}
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        lateFirst={false}
        setLateFirst={mockSetLateFirst}
      />
    )

    const filterButton = screen.getByTestId('filter-selector-pending')
    const routeFilterButton = screen.getByTestId('route-filter-button-all')

    await user.click(filterButton)
    await user.click(routeFilterButton)

    expect(mockSetSelectedFilter).toHaveBeenCalledWith('pending')
    expect(mockSetSelectedRoute).toHaveBeenCalledWith('all')

    rerender(<RouteFilters
      filterButtons={mockFilterButtons}
      selectedFilter="pending"
      setSelectedFilter={mockSetSelectedFilter}
      routeFilterButtons={mockRouteFilterButtons}
      selectedRoute="all"
      setSelectedRoute={mockSetSelectedRoute}
      searchQuery=""
      setSearchQuery={mockSetSearchQuery}
      lateFirst={false}
      setLateFirst={mockSetLateFirst}
    />)

    expect(filterButton).toHaveClass('bg-blue-100 text-blue-800 border border-blue-200')
    expect(routeFilterButton).toHaveClass('bg-emerald-100 text-emerald-800 border border-emerald-200')
  })

  it('toggles late-first sorting', async () => {
    const user = userEvent.setup()
    render(
      <RouteFilters
        filterButtons={mockFilterButtons}
        selectedFilter="all"
        setSelectedFilter={mockSetSelectedFilter}
        routeFilterButtons={mockRouteFilterButtons}
        selectedRoute="all"
        setSelectedRoute={mockSetSelectedRoute}
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        lateFirst={false}
        setLateFirst={mockSetLateFirst}
      />
    )

    await user.click(screen.getByTestId('late-first-toggle'))
    expect(mockSetLateFirst).toHaveBeenCalledWith(true)
  })
})
