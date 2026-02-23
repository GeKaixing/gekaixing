'use client'

import { useState } from 'react'
import { ArrowLeft, Search, UserCheck, UserPlus, X } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface UserProfile {
  id: string
  nameKey: string
  handle: string
  avatar: string
  bioKey: string
  isFollowing: boolean
  isVerified?: boolean
}

const mockUsers: UserProfile[] = [
  { id: '1', nameKey: 'users.techDaily.name', handle: '@techdaily', avatar: '', bioKey: 'users.techDaily.bio', isFollowing: false, isVerified: true },
  { id: '2', nameKey: 'users.design.name', handle: '@designhub', avatar: '', bioKey: 'users.design.bio', isFollowing: true, isVerified: false },
  { id: '3', nameKey: 'users.coder.name', handle: '@codegeek', avatar: '', bioKey: 'users.coder.bio', isFollowing: false, isVerified: true },
  { id: '4', nameKey: 'users.food.name', handle: '@foodie', avatar: '', bioKey: 'users.food.bio', isFollowing: false, isVerified: false },
  { id: '5', nameKey: 'users.photo.name', handle: '@photoxm', avatar: '', bioKey: 'users.photo.bio', isFollowing: false, isVerified: true },
]

type TabType = 'recommended' | 'followers' | 'following'

export default function ConnectPeoplePage(): JSX.Element {
  const t = useTranslations('ImitationX.ConnectPeople')
  const [activeTab, setActiveTab] = useState<TabType>('recommended')
  const [users, setUsers] = useState<UserProfile[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState('')

  const handleFollow = (userId: string): void => {
    setUsers((prev: UserProfile[]) =>
      prev.map((user: UserProfile) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    )
  }

  const filteredUsers = users.filter((user: UserProfile) => {
    const name = t(user.nameKey).toLowerCase()
    const bio = t(user.bioKey).toLowerCase()
    const q = searchQuery.toLowerCase()

    return name.includes(q) || user.handle.toLowerCase().includes(q) || bio.includes(q)
  })

  const tabs: { id: TabType; label: string }[] = [
    { id: 'recommended', label: t('tabs.recommended') },
    { id: 'followers', label: t('tabs.followers') },
    { id: 'following', label: t('tabs.following') },
  ]

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <div className='sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-md'>
        <div className='flex items-center gap-4 px-4 py-3'>
          <Link href='/imitation-x' className='rounded-full p-2 transition-colors hover:bg-muted/70'>
            <ArrowLeft className='h-5 w-5' />
          </Link>
          <div>
            <h1 className='text-xl font-bold'>{t('title')}</h1>
            <p className='text-sm text-muted-foreground'>{t('userCount', { count: users.length })}</p>
          </div>
        </div>

        <div className='px-4 py-2'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <input
              type='text'
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className='w-full rounded-full bg-muted py-2 pl-10 pr-10 text-sm text-foreground transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/70 p-0.5 transition-colors hover:bg-muted-foreground'
              >
                <X className='h-3 w-3 text-white' />
              </button>
            )}
          </div>
        </div>

        <div className='flex border-b border-border'>
          {tabs.map((tab: { id: TabType; label: string }) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex-1 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              )}
            >
              {tab.label}
              {activeTab === tab.id && <div className='absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-blue-500' />}
            </button>
          ))}
        </div>
      </div>

      <div className='divide-y divide-border'>
        {filteredUsers.length === 0 ? (
          <div className='py-12 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
              <Search className='h-8 w-8 text-muted-foreground' />
            </div>
            <p className='text-muted-foreground'>{t('empty')}</p>
          </div>
        ) : (
          filteredUsers.map((user: UserProfile) => (
            <div
              key={user.id}
              className='flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/60'
            >
              <Link href={`/imitation-x/user/${user.id}`}>
                <Avatar className='h-12 w-12'>
                  <AvatarImage src={user.avatar} alt={t(user.nameKey)} />
                  <AvatarFallback className='bg-muted font-medium text-muted-foreground'>
                    {t(user.nameKey).slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className='min-w-0 flex-1'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-1'>
                      <Link href={`/imitation-x/user/${user.id}`} className='truncate text-sm font-bold hover:underline'>
                        {t(user.nameKey)}
                      </Link>
                      {user.isVerified && (
                        <svg className='h-4 w-4 flex-shrink-0 text-blue-500' fill='currentColor' viewBox='0 0 24 24'>
                          <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
                        </svg>
                      )}
                    </div>
                    <p className='truncate text-sm text-muted-foreground'>{user.handle}</p>
                  </div>

                  <Button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation()
                      handleFollow(user.id)
                    }}
                    variant={user.isFollowing ? 'outline' : 'default'}
                    size='sm'
                    className={cn(
                      'min-w-[80px] rounded-full text-sm font-bold transition-all',
                      user.isFollowing
                        ? 'border-border hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-500'
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                    )}
                  >
                    {user.isFollowing ? (
                      <span className='flex items-center gap-1'>
                        <UserCheck className='h-4 w-4' />
                        {t('following')}
                      </span>
                    ) : (
                      <span className='flex items-center gap-1'>
                        <UserPlus className='h-4 w-4' />
                        {t('follow')}
                      </span>
                    )}
                  </Button>
                </div>

                <Link href={`/imitation-x/user/${user.id}`}>
                  <p className='mt-1 line-clamp-2 text-sm text-foreground/85'>{t(user.bioKey)}</p>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredUsers.length > 0 && (
        <div className='py-4 text-center'>
          <Button variant='ghost' className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'>
            {t('loadMore')}
          </Button>
        </div>
      )}
    </div>
  )
}
