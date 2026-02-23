// store/AiSessions.ts
import { create } from "zustand";

export interface AiSession {
  id: string;
  userId: string;
  title: string;
  tokenUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

// 定义 store 的类型
interface AiSessionsStore {
  sessions: AiSession[];
  setSessions: (sessions: AiSession[]) => void;
  addSession: (session: AiSession) => void;
  updateSessionTitle: (id: string, title: string) => void;
  removeSession: (id: string) => void;
}

// 创建 store
export const useAiSessions = create<AiSessionsStore>((set) => ({
  sessions: [],

  setSessions: (sessions) => set({ sessions }),
  addSession: (session) =>
    set((state) => ({
      sessions: state.sessions.some((item) => item.id === session.id)
        ? state.sessions.map((item) =>
          item.id === session.id ? { ...item, ...session } : item
        )
        : [...state.sessions, session],
    })),
  updateSessionTitle: (id, title) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id
          ? {
            ...session,
            title,
            updatedAt: new Date(),
          }
          : session
      ),
    })),
  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
    })),
}));
