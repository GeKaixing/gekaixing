'use client'

import { useState } from 'react'
import { AtSign, Heart, MessageCircle, MoreHorizontal, Repeat2, UserPlus, Verified } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'like' | 'follow' | 'repost' | 'reply' | 'mention' | 'verified'
  user: {
    nameKey: string
    handle: string
    avatar: string
  }
  contentKey?: string
  postContentKey?: string
  timeKey: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: { nameKey: 'users.zhangsan', handle: '@zhangsan', avatar: '' },
    postContentKey: 'posts.1',
    timeKey: 'times.1',
    read: false,
  },
  {
    id: '2',
    type: 'follow',
    user: { nameKey: 'users.lisi', handle: '@lisi', avatar: '' },
    timeKey: 'times.2',
    read: false,
  },
  {
    id: '3',
    type: 'repost',
    user: { nameKey: 'users.wangwu', handle: '@wangwu', avatar: '' },
    postContentKey: 'posts.2',
    timeKey: 'times.3',
    read: true,
  },
  {
    id: '4',
    type: 'reply',
    user: { nameKey: 'users.zhaoliu', handle: '@zhaoliu', avatar: '' },
    contentKey: 'contents.1',
    postContentKey: 'posts.3',
    timeKey: 'times.4',
    read: true,
  },
  {
    id: '5',
    type: 'mention',
    user: { nameKey: 'users.qianqi', handle: '@qianqi', avatar: '' },
    contentKey: 'contents.2',
    timeKey: 'times.5',
    read: true,
  },
  {
    id: '6',
    type: 'verified',
    user: { nameKey: 'users.system', handle: '@system', avatar: '' },
    contentKey: 'contents.3',
    timeKey: 'times.6',
    read: true,
  },
]

function NotificationIcon({ type }: { type: Notification['type'] }): JSX.Element | null {
  const iconClass = 'h-5 w-5'

  switch (type) {
    case 'like':
      return <Heart className={cn(iconClass, 'fill-red-500 text-red-500')} />
    case 'follow':
      return <UserPlus className={cn(iconClass, 'text-blue-500')} />
    case 'repost':
      return <Repeat2 className={cn(iconClass, 'text-green-500')} />
    case 'reply':
      return <MessageCircle className={cn(iconClass, 'text-blue-500')} />
    case 'mention':
      return <AtSign className={cn(iconClass, 'text-blue-500')} />
    case 'verified':
      return <Verified className={cn(iconClass, 'text-blue-500')} />
    default:
      return null
  }
}

function getNotificationText(t: ReturnType<typeof useTranslations>, type: Notification['type']): string {
  switch (type) {
    case 'like':
      return t('actions.like')
    case 'follow':
      return t('actions.follow')
    case 'repost':
      return t('actions.repost')
    case 'reply':
      return t('actions.reply')
    case 'mention':
      return t('actions.mention')
    case 'verified':
      return ''
    default:
      return ''
  }
}

function NotificationItem({ notification }: { notification: Notification }): JSX.Element {
  const t = useTranslations('ImitationX.Notifications')

  return (
    <div
      className={cn(
        'flex cursor-pointer gap-3 border-b border-border p-4 transition-colors hover:bg-accent/50',
        !notification.read && 'bg-blue-50/50 dark:bg-blue-950/20'
      )}
    >
      <div className='flex w-10 flex-shrink-0 justify-end'>
        <NotificationIcon type={notification.type} />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={notification.user.avatar} />
              <AvatarFallback className='text-xs'>{t(notification.user.nameKey).slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <button className='rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground'>
            <MoreHorizontal className='h-4 w-4' />
          </button>
        </div>

        <div className='mt-1'>
          <span className='font-semibold text-foreground'>{t(notification.user.nameKey)}</span>{' '}
          <span className='text-muted-foreground'>{notification.user.handle}</span>{' '}
          <span className='text-foreground'>{getNotificationText(t, notification.type)}</span>
          <span className='ml-1 text-sm text-muted-foreground'>· {t(notification.timeKey)}</span>
        </div>

        {notification.contentKey && <p className='mt-2 text-foreground'>{t(notification.contentKey)}</p>}

        {notification.postContentKey && notification.type !== 'mention' && (
          <div className='mt-2 rounded-xl border border-border bg-muted/50 p-3'>
            <p className='line-clamp-2 text-sm text-muted-foreground'>{t(notification.postContentKey)}</p>
          </div>
        )}

        {notification.type === 'follow' && (
          <button className='mt-3 rounded-full border border-border px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-accent'>
            {t('followBack')}
          </button>
        )}
      </div>
    </div>
  )
}

function NotificationList({
  notifications,
  filter,
}: {
  notifications: Notification[]
  filter: 'all' | 'mentions'
}): JSX.Element {
  const t = useTranslations('ImitationX.Notifications')
  const filteredNotifications =
    filter === 'mentions' ? notifications.filter((n: Notification) => n.type === 'mention' || n.type === 'reply') : notifications

  if (filteredNotifications.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center px-4 py-16'>
        <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
          {filter === 'mentions' ? <AtSign className='h-8 w-8 text-muted-foreground' /> : <Heart className='h-8 w-8 text-muted-foreground' />}
        </div>
        <h3 className='mb-2 text-xl font-bold text-foreground'>
          {filter === 'mentions' ? t('empty.mentionsTitle') : t('empty.allTitle')}
        </h3>
        <p className='max-w-sm text-center text-muted-foreground'>
          {filter === 'mentions' ? t('empty.mentionsDesc') : t('empty.allDesc')}
        </p>
      </div>
    )
  }

  return (
    <div className='divide-y divide-border'>
      {filteredNotifications.map((notification: Notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}

export default function NotificationsPage(): JSX.Element {
  const t = useTranslations('ImitationX.Notifications')
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className='min-h-screen'>
      <div className='sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md'>
        <div className='flex items-center justify-between px-4 py-3'>
          <h1 className='text-xl font-bold'>{t('title')}</h1>
          <button className='rounded-full p-2 transition-colors hover:bg-accent'>
            <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
              />
            </svg>
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='h-auto w-full justify-between rounded-none border-b border-border bg-transparent p-0'>
            <TabsTrigger
              value='all'
              className='flex-1 rounded-none py-3 transition-colors hover:bg-accent/50 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              {t('tabs.all')}
            </TabsTrigger>
            <TabsTrigger
              value='mentions'
              className='flex-1 rounded-none py-3 transition-colors hover:bg-accent/50 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              {t('tabs.mentions')}
            </TabsTrigger>
            <TabsTrigger
              value='verified'
              className='flex-1 rounded-none py-3 transition-colors hover:bg-accent/50 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              <div className='flex items-center gap-1'>
                <Verified className='h-4 w-4' />
                {t('tabs.verified')}
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='all' className='mt-0'>
            <NotificationList notifications={mockNotifications} filter='all' />
          </TabsContent>

          <TabsContent value='mentions' className='mt-0'>
            <NotificationList notifications={mockNotifications} filter='mentions' />
          </TabsContent>

          <TabsContent value='verified' className='mt-0'>
            <NotificationList notifications={mockNotifications.filter((n: Notification) => n.type === 'verified')} filter='all' />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
