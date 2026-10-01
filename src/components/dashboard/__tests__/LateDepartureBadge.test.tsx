import { render, screen } from '@testing-library/react'
import LateDepartureBadge from '../LateDepartureBadge'

describe('LateDepartureBadge', () => {
	it('renders with minutes value', () => {
		render(<LateDepartureBadge minutes={7} />)
		expect(screen.getByTestId('late-departure-badge')).toBeInTheDocument()
	})
})
