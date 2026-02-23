import { create } from 'zustand'

export type ReplyItem = {
  id: string
  content: string
  createdAt: Date

  user_id: string
  user_name: string | null
  user_avatar: string | null
  user_userid: string
  isPremium: boolean

  like: number
  star: number
  share: number
  reply: number

  likedByMe: boolean
  bookmarkedByMe: boolean
  sharedByMe: boolean
}

type ReplyState = {
  replies: ReplyItem[]
  setReplies: (replies: ReplyItem[]) => void
  appendReplies: (replies: ReplyItem[]) => void
  addReply: (reply: ReplyItem) => void
  replaceReply: (tempId: string, realReply: ReplyItem) => void
  removeReply: (id: string) => void
  updateReply: (id: string, patch: Partial<ReplyItem>) => void
}

export const replyStore = create<ReplyState>((set) => ({
  replies: [],

  setReplies: (replies) => set({ replies }),
  appendReplies: (replies) =>
    set((state) => {
      const nextReplies = [...state.replies]
      const existingIds = new Set(state.replies.map((reply) => reply.id))

      for (const reply of replies) {
        if (!existingIds.has(reply.id)) {
          nextReplies.push(reply)
          existingIds.add(reply.id)
        }
      }

      return { replies: nextReplies }
    }),

  addReply: (reply) =>
    set((state) => ({
      replies: [reply, ...state.replies],
    })),

  replaceReply: (tempId, realReply) =>
    set((state) => ({
      replies: state.replies.map((r) =>
        r.id === tempId ? realReply : r
      ),
    })),

  removeReply: (id) =>
    set((state) => ({
      replies: state.replies.filter((r) => r.id !== id),
    })),

  updateReply: (id, patch) =>
    set((state) => ({
      replies: state.replies.map((reply) =>
        reply.id === id ? { ...reply, ...patch } : reply
      ),
    })),
}))
