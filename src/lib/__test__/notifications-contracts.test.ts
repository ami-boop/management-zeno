import {
  formatNotificationTime,
  parseNotification,
  parseNotifications,
  parseNotificationsPage,
} from '@/lib/api-contracts/notifications'

describe('parseNotification', () => {
  it('maps backend shape to UI shape', () => {
    const parsed = parseNotification({
      id: 'n1',
      message: 'Bus delayed',
      type: 'alert',
      isRead: false,
      priority: 'high',
      createdAt: { _seconds: 1789416000, _nanoseconds: 0 },
    })
    expect(parsed).toMatchObject({ id: 'n1', message: 'Bus delayed', type: 'alert', isRead: false, priority: 'high' })
    expect(parsed!.time).toMatch(/\d{2}\.\d{2}\.\d{4}/)
  })

  it('falls back for unknown type and missing fields', () => {
    const parsed = parseNotification({ id: 'n2', type: 'weird', createdAt: '2026-09-15T10:00:00.000Z' })
    expect(parsed).toMatchObject({ id: 'n2', message: '', type: 'info', isRead: false, priority: 'medium' })
  })

  it('returns null for garbage', () => {
    expect(parseNotification(null)).toBeNull()
    expect(parseNotification({})).toBeNull()
    expect(parseNotifications('nope')).toEqual([])
  })

  it('parses paged responses', () => {
    const page = parseNotificationsPage({ items: [{ id: 'n1' }], nextCursor: 'abc' })
    expect(page).toEqual({ items: [expect.objectContaining({ id: 'n1' })], nextCursor: 'abc' })
    expect(parseNotificationsPage({ items: [] })?.nextCursor).toBeNull()
    expect(parseNotificationsPage([])).toBeNull()
  })
})

describe('formatNotificationTime', () => {
  it('handles ISO strings and garbage', () => {
    expect(formatNotificationTime('2026-09-15T10:00:00.000Z')).toMatch(/15\.09\.2026/)
    expect(formatNotificationTime('garbage')).toBe('')
    expect(formatNotificationTime(null)).toBe('')
  })
})
