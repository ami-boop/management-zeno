import { render, screen, waitFor } from '@testing-library/react';
import Client from '../Client';
import setNotificationsAction from '@/app/actions/setNotificationsAction';
import { notifications } from '@/mocks/tests';
import userEvent from '@testing-library/user-event';

// Mock setNotificationsAction
jest.mock('@/app/actions/setNotificationsAction', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock NotificationList with props to verify correct data is passed
jest.mock('../List', () => ({
  __esModule: true,
  default: ({ notifications, markAsRead, removeNotification }: any) => (
    <div>
      <div data-testid="notification-list">NotificationList</div>
      <div data-testid="notification-count">{notifications.length}</div>
      {/* Expose functions for testing */}
      <button onClick={() => markAsRead('test-id')}>Test Mark Read</button>
      <button onClick={() => removeNotification('test-id')}>Test Remove</button>
    </div>
  ),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('NotificationsClient', () => {
  beforeEach(() => {
    (setNotificationsAction as jest.Mock).mockClear();
    (setNotificationsAction as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Initial Render', () => {
    it('should render the component with initial notifications', () => {
      render(<Client initialNotifications={notifications} />);

      expect(screen.getByText('title')).toBeInTheDocument();
      expect(screen.getByText('description')).toBeInTheDocument();
      expect(screen.getByTestId('notification-list')).toBeInTheDocument();
    });

    it('should display unread count badge when there are unread notifications', () => {
      const unreadCount = notifications.filter(n => !n.isRead).length;
      render(<Client initialNotifications={notifications} />);

      expect(screen.getByText(`${unreadCount} unread`)).toBeInTheDocument();
    });

    it('should not display unread badge when all notifications are read', () => {
      const readNotifications = notifications.map(n => ({ ...n, isRead: true }));
      render(<Client initialNotifications={readNotifications} />);

      expect(screen.queryByText(/unread/)).not.toBeInTheDocument();
    });

    it('should render all filter buttons with correct counts', () => {
      render(<Client initialNotifications={notifications} />);

      const allCount = notifications.length;
      const unreadCount = notifications.filter(n => !n.isRead).length;
      const alertCount = notifications.filter(n => n.type === 'alert').length;
      const infoCount = notifications.filter(n => n.type === 'info' || n.type === 'success').length;

      expect(screen.getByRole('button', { name: `filterAll ${allCount}` })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: `filterUnread ${unreadCount}` })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: `filterAlerts ${alertCount}` })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: `filterInfo ${infoCount}` })).toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    it('should filter notifications by unread status', async () => {
      const user = userEvent.setup();
      render(<Client initialNotifications={notifications} />);

      const unreadButton = screen.getByRole('button', { name: /filterUnread/i });
      await user.click(unreadButton);

      // Check that button is active
      expect(unreadButton).toHaveClass('bg-zeno-amber');
    });

    it('should filter notifications by alerts', async () => {
      const user = userEvent.setup();
      render(<Client initialNotifications={notifications} />);

      const alertsButton = screen.getByRole('button', { name: /filterAlerts/i });
      await user.click(alertsButton);

      expect(alertsButton).toHaveClass('bg-zeno-amber');
    });

    it('should filter notifications by info', async () => {
      const user = userEvent.setup();
      render(<Client initialNotifications={notifications} />);

      const infoButton = screen.getByRole('button', { name: /filterInfo/i });
      await user.click(infoButton);

      expect(infoButton).toHaveClass('bg-zeno-amber');
    });

    it('should show all notifications when "all" filter is selected', async () => {
      const user = userEvent.setup();
      render(<Client initialNotifications={notifications} />);

      // First click another filter
      const unreadButton = screen.getByRole('button', { name: /filterUnread/i });
      await user.click(unreadButton);

      // Then click "all"
      const allButton = screen.getByRole('button', { name: /filterAll/i });
      await user.click(allButton);

      expect(allButton).toHaveClass('bg-zeno-amber');
      expect(screen.getByTestId('notification-count')).toHaveTextContent(
        notifications.length.toString()
      );
    });
  });

  describe('Mark All as Read', () => {
    it('should mark all notifications as read when button is clicked', async () => {
      const user = userEvent.setup();
      render(<Client initialNotifications={notifications} />);

      const markAllButton = screen.getByRole('button', { name: /markAllRead/i });
      await user.click(markAllButton);

      // Button should disappear after marking all as read
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /markAllRead/i })).not.toBeInTheDocument();
      });

      // Unread badge should disappear
      await waitFor(() => {
        expect(screen.queryByText(/\d+ unread/i)).not.toBeInTheDocument();
      });

      // Check that the server action was called
      expect(setNotificationsAction).toHaveBeenCalledWith({ markAllAsRead: true });
      expect(setNotificationsAction).toHaveBeenCalledTimes(1);
    });

    it('should not show "mark all as read" button when there are no unread notifications', () => {
      const readNotifications = notifications.map(n => ({ ...n, isRead: true }));
      render(<Client initialNotifications={readNotifications} />);

      expect(screen.queryByRole('button', { name: /markAllRead/i })).not.toBeInTheDocument();
    });
  });

  describe('Clear All Functionality', () => {
    it('should clear all notifications when "clear all" button is clicked', async () => {
      const user = userEvent.setup();
      render(<Client initialNotifications={notifications} />);

      const clearAllButton = screen.getByRole('button', { name: /clearAll/i });
      await user.click(clearAllButton);

      // Check that the server action was called
      expect(setNotificationsAction).toHaveBeenCalledWith({ clearAll: true });
      expect(setNotificationsAction).toHaveBeenCalledTimes(1);

      // Button should disappear after clearing all
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /clearAll/i })).not.toBeInTheDocument();
      });
    });

    it('should not show "clear all" button when there are no notifications', () => {
      render(<Client initialNotifications={[]} />);

      expect(screen.queryByRole('button', { name: /clearAll/i })).not.toBeInTheDocument();
    });
  });

  describe('Individual Notification Actions', () => {
    it('should call markAsRead with correct id', async () => {
      const user = userEvent.setup();
      render(<Client initialNotifications={notifications} />);

      // Use the exposed test button from mocked NotificationList
      const testButton = screen.getByText('Test Mark Read');
      await user.click(testButton);

      await waitFor(() => {
        expect(setNotificationsAction).toHaveBeenCalledWith({ markAsReadId: 'test-id' });
      });
    });

    it('should call removeNotification with correct id', async () => {
      const user = userEvent.setup();
      render(<Client initialNotifications={notifications} />);

      // Use the exposed test button from mocked NotificationList
      const testButton = screen.getByText('Test Remove');
      await user.click(testButton);

      await waitFor(() => {
        expect(setNotificationsAction).toHaveBeenCalledWith({ clearNotificationId: 'test-id' });
      });
    });
  });
});
