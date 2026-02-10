'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Suspense } from 'react'
import EditPost from './EditPost'

function PostModalInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const isOpen = searchParams.get('new') === 'post'

  const closeModal = () => {
    router.replace(pathname, { scroll: false })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={closeModal} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-lg max-w-lg w-full mx-4">
          <EditPost onClose={closeModal} />
        </div>
      </div>
    </>
  )
}

export default function PostModal() {
  return (
    <Suspense fallback={null}>
      <PostModalInner />
    </Suspense>
  )
}
