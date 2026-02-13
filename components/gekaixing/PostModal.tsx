"use client"

import { postModalStore } from '@/store/postModal'
import EditPost from './EditPost'

export default function PostModal() {
  const { isOpen, closeModal } = postModalStore()

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
