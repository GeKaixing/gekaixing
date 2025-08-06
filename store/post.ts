import { create } from "zustand";

export type Post = {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_avatar: string;
  content: string;
  like: number;
  star: number;
  reply_count: number;
  share: number;
};

type Store = {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  updatePost: (id: string, newData: Partial<Post>) => void;
  addPost: (newPost: Post) => void;
  deletePost: (id: string) => void;
  addReplyCount: (id: string) => void;
  subReplyCount: (id: string) => void;
};

export const postStore = create<Store>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),

  addReplyCount: (id) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id
          ? { ...post, reply_count: (post.reply_count || 0) + 1 }
          : post
      ),
    })),

  subReplyCount: (id) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id
          ? { ...post, reply_count: Math.max(0, (post.reply_count || 0) - 1) }
          : post
      ),
    })),

  // ✅ 添加新的帖子到最前面
  addPost: (newPost) =>
    set((state) => ({
      posts: [newPost, ...state.posts],
    })),

  // ✅ 删除指定 id 的帖子
  deletePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== id),
    })),

  // ✅ 更新已有帖子字段
  updatePost: (id, newData) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, ...newData } : post
      ),
    })),
}));
