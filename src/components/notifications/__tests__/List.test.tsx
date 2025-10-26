import { screen, render } from '@testing-library/react'
import List from '../List'
import { notifications } from '@/mocks/tests'

jest.mock('../NotificationCard', () => () => <div>NotificationCard</div>)

describe('NotificationList', () => {
  const markAsRead = jest.fn()
  const removeNotification = jest.fn()

  it('renders correctly', () => {
    render(<List notifications={notifications} markAsRead={markAsRead} removeNotification={removeNotification} />)

    expect(screen.getAllByText('NotificationCard')).toHaveLength(notifications.length)
  })
  it('renders correctly when have no notifications', () => {
    render(<List notifications={[]} markAsRead={markAsRead} removeNotification={removeNotification} />)

    expect(screen.getByTestId('bell-icon')).toBeInTheDocument()
    expect(screen.getByRole('heading')).toHaveTextContent('noNotifications')
    expect(screen.getByText('noNotificationsDesc')).toBeInTheDocument()
  })
})
