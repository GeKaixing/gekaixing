import { create } from 'zustand'

export type ReplyItem = {
  id: string
  content: string
  createdAt: Date

  user_id: string
  user_name: string | null
  user_avatar: string | null
  user_userid: string

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
  addReply: (reply: ReplyItem) => void
  replaceReply: (tempId: string, realReply: ReplyItem) => void
  removeReply: (id: string) => void
}

export const replyStore = create<ReplyState>((set) => ({
  replies: [],

  setReplies: (replies) => set({ replies }),

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
}))
