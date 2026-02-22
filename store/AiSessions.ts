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
  removeSession: (id: string) => void;
}

// 创建 store
export const useAiSessions = create<AiSessionsStore>((set) => ({
  sessions: [],

  setSessions: (sessions) => set({ sessions }),
  addSession: (session) =>
    set((state) => ({
      sessions: [...state.sessions, session],
    })),
  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
    })),
}));
