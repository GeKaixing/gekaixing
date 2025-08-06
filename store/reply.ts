import { create } from "zustand";

export type replys = {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_avatar: string;
  content: string;
  post_id: string;
  like: number;
  star: number;
  reply_count: number;
  share: number;
  reply_id: string | null;
};

type Store = {
  replys: replys[];
  setPosts: (posts: replys[]) => void;
  updateReply: (id: string, newData: Partial<replys>) => void;
  addReply: (newPost: replys) => void;
  deleteReply: (id: string) => void;
  deleteFirstReply: () => void;
};

export const replyStore = create<Store>((set) => ({
  replys: [],
  setPosts: (replys) => set({ replys }),

  // ✅ 添加新的帖子到最前面
  addReply: (newPost) =>
    set((state) => ({
      replys: [newPost, ...state.replys],
    })),

  // ✅ 删除指定 id 的帖子
  deleteReply: (id) =>
    set((state) => ({
      replys: state.replys.filter((post) => post.id !== id),
    })),

  // ✅ 更新已有帖子字段
  updateReply: (id, newData) =>
    set((state) => ({
      replys: state.replys.map((post) =>
        post.id === id ? { ...post, ...newData } : post
      ),
    })),
  deleteFirstReply: () =>
    set((state) => ({
      replys: state.replys.slice(1), // ✅ 删除第一个元素
    })),
}));
