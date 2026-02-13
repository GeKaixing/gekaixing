import { create } from 'zustand'

interface PostModalStore {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const postModalStore = create<PostModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))
