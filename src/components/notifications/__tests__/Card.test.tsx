import { screen, render } from '@testing-library/react'
import Card from '../Card'
import type { Notification } from '@/types/notification'
import { notifications } from '@/mocks/tests';
import userEvent from '@testing-library/user-event';

jest.mock('@/utils/notificationUtils', () => ({
  getNotificationIcon: jest.fn(() => <div data-testid="notification-icon" />),
  getNotificationStyle: jest.fn(() => 'notification-style'),
  getPriorityBadge: jest.fn(() => <div data-testid="priority-badge" />),
}));

describe('NotificationCard', () => {
  const notification: Notification = notifications[0]
  const markAsRead = jest.fn()
  const removeNotification = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('renders correctly when unread', () => {
    render(<Card notification={notification} markAsRead={markAsRead} removeNotification={removeNotification} />)

    expect(screen.getByTestId('notification-icon')).toBeInTheDocument()
    expect(screen.getByTestId('priority-badge')).toBeInTheDocument()
    expect(screen.getByText('messages.late')).toBeInTheDocument()
    expect(screen.getByText('2024-03-15T08:00:00')).toBeInTheDocument()

    expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
    expect(screen.getByTestId('mark-as-read-button')).toBeInTheDocument()
    expect(screen.getByTestId('remove-notification-button')).toBeInTheDocument()
    expect(screen.getByText('messages.late')).not.toHaveClass('text-gray-600')

  })

  it('renders correctly when read', () => {
    render(
      <Card
        notification={{ ...notification, isRead: true }}
        markAsRead={markAsRead}
        removeNotification={removeNotification}
      />)

    expect(screen.queryByTestId('mark-as-read-button')).not.toBeInTheDocument()
    expect(screen.getByText('messages.late')).toHaveClass('text-gray-600')
  })

  it('isRead, removeNotification buttons works correcrtly', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <Card
        notification={notification}
        markAsRead={markAsRead}
        removeNotification={removeNotification}
      />
    )

    const markAsReadButton = screen.getByTestId('mark-as-read-button')
    const removeNotificationButton = screen.getByTestId('remove-notification-button')

    await user.click(markAsReadButton)

    expect(markAsRead).toHaveBeenCalledWith('1')

    rerender(
      <Card
        notification={{ ...notification, isRead: true }}
        markAsRead={markAsRead}
        removeNotification={removeNotification}
      />
    )
    expect(screen.queryByTestId('mark-as-read-button')).not.toBeInTheDocument()

    await user.click(removeNotificationButton)

    expect(removeNotification).toHaveBeenCalledWith('1')
  })
})
