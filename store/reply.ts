import { Reply } from "@/components/gekaixing/ReplyStore";
import { create } from "zustand";
type Store = {
  replys: Reply[];
  setPosts: (posts: Reply[]) => void;
  updateReply: (id: string, newData: Partial<Reply>) => void;
  addReply: (newPost: Reply) => void;
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
