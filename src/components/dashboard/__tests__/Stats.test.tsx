import { render, screen } from '@testing-library/react';
import Stats from '../Stats';

const mockStats = [
  { label: 'studentsOnBus', value: 145 },
  { label: 'studentsNotMarked', value: 40 },
  { label: 'busesNeeded', value: 7 },
];

describe('Stats', () => {
  it('renders the correct number of stats', () => {
    render(<Stats stats={mockStats} />);
    const statContainers = screen.getAllByTestId('stat-container');
    expect(statContainers).toHaveLength(mockStats.length);
  });

  it('renders the correct labels and values', () => {
    render(<Stats stats={mockStats} />);

    expect(screen.getByText('stats.studentsOnBus')).toBeInTheDocument();
    expect(screen.getByText('145')).toBeInTheDocument();

    expect(screen.getByText('stats.studentsNotMarked')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();

    expect(screen.getByText('stats.busesNeeded')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
