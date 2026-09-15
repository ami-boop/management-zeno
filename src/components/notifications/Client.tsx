'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Archive, CheckCircle } from 'lucide-react'
import type { Notification } from '@/types/notification'
import List from './List'
import setNotificationsAction from '@/app/actions/setNotificationsAction'
import { getNotificationsPage } from '@/app/actions/getNotificationsPage'

interface NotificationsClientProps {
  initialNotifications: Notification[]
  initialCursor?: string | null
}

const PAGE_LIMIT = 30

export default function Client({
  initialNotifications,
  initialCursor = null,
}: NotificationsClientProps) {
  const t = useTranslations('Notifications')
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pageError, setPageError] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const removeNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    await setNotificationsAction({ clearNotificationId: id })
  }

  const markAsRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    )
    await setNotificationsAction({ markAsReadId: id })
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    await setNotificationsAction({ markAllAsRead: true })
  }

  const clearAll = async () => {
    setNotifications([])
    setCursor(null)
    await setNotificationsAction({ clearAll: true })
  }

  const loadMore = useCallback(async () => {
    if (loadingMore || !cursor) return
    setLoadingMore(true)
    setPageError(false)
    const result = await getNotificationsPage(cursor, PAGE_LIMIT)
    if (!result.ok || !result.data) {
      setLoadingMore(false)
      setPageError(true)
      return
    }
    const fresh = result.data.items.filter(
      item => !notifications.some(n => n.id === item.id)
    )
    setNotifications([...notifications, ...fresh])
    setCursor(result.data.nextCursor)
    setLoadingMore(false)
  }, [cursor, loadingMore, notifications])

  useEffect(() => {
    if (!cursor) return
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) void loadMore()
      },
      { rootMargin: '400px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [cursor, loadMore])

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      switch (selectedFilter) {
        case 'unread':
          return !notification.isRead
        case 'alerts':
          return notification.type === 'alert'
        case 'info':
          return notification.type === 'info' || notification.type === 'success'
        default:
          return true
      }
    })
  }, [notifications, selectedFilter])

  const unreadCount = notifications.filter(n => !n.isRead).length
  const alertCount = notifications.filter(n => n.type === 'alert').length

  const filterButtons = [
    { key: 'all', label: t('filterAll'), count: notifications.length },
    { key: 'unread', label: t('filterUnread'), count: unreadCount },
    { key: 'alerts', label: t('filterAlerts'), count: alertCount },
    {
      key: 'info',
      label: t('filterInfo'),
      count: notifications.filter(
        n => n.type === 'info' || n.type === 'success'
      ).length,
    },
  ]

  return (
    <div className='min-h-screen'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight text-zeno-ink mb-2'>
                {t('title')}
              </h1>
              <p className='text-sm text-zeno-ink-soft'>{t('description')}</p>
            </div>
            <div className='flex items-center gap-2'>
              {unreadCount > 0 && (
                <div className='bg-zeno-danger-soft text-zeno-danger px-3 py-1 rounded-full text-sm font-medium tabular-nums'>
                  {unreadCount} {t('unread')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className='zeno-card mb-6'>
          <div className='px-6 py-4 border-b border-zeno-line'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              {/* Filters */}
              <div className='flex flex-wrap gap-2'>
                {filterButtons.map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    aria-pressed={selectedFilter === filter.key}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber ${selectedFilter === filter.key
                      ? 'bg-zeno-amber text-zeno-amber-fg'
                      : 'bg-zeno-surface text-zeno-ink-soft border border-zeno-line hover:bg-zeno-paper-soft'
                      }`}
                    data-testid='filter-button'
                  >
                    {filter.label}
                    <span
                      className={`ms-2 px-2 py-0.5 rounded-full text-xs tabular-nums ${selectedFilter === filter.key
                        ? 'bg-white/50 text-zeno-amber-fg'
                        : 'bg-zeno-paper-soft text-zeno-muted'
                        }`}
                    >
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className='flex items-center gap-2'>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className='inline-flex items-center px-3 py-1.5 text-sm text-zeno-sage hover:bg-zeno-sage-soft rounded-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
                  >
                    <CheckCircle className='w-4 h-4 me-1' data-testid='check-circle-icon' />
                    {t('markAllRead')}
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className='inline-flex items-center px-3 py-1.5 text-sm text-zeno-danger hover:bg-zeno-danger-soft rounded-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
                  >
                    <Archive className='w-4 h-4 me-1' data-testid='archive-icon' />
                    {t('clearAll')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <List
          notifications={filteredNotifications}
          markAsRead={markAsRead}
          removeNotification={removeNotification}
        />

        {cursor && <div ref={sentinelRef} aria-hidden='true' className='h-1' />}
        {loadingMore && (
          <p className='py-4 text-center text-sm text-zeno-muted'>{t('loadingMore')}</p>
        )}
        {pageError && (
          <div className='py-4 text-center'>
            <button
              type='button'
              onClick={() => void loadMore()}
              className='rounded-full border border-zeno-line-strong bg-zeno-surface px-4 py-1.5 text-xs font-semibold text-zeno-ink hover:bg-zeno-paper-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber'
            >
              {t('retry')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
