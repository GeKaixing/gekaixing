import { Post } from "@/app/imitation-x/page";
import { create } from "zustand";

type Store = {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  appendPosts: (posts: Post[]) => void;
  updatePost: (id: string, newData: Partial<Post>) => void;
  addPost: (newPost: Post) => void;
  deletePost: (id: string) => void;
  addReplyCount: (id: string) => void;
  subReplyCount: (id: string) => void;
};

export const postStore = create<Store>((set) => ({
  posts: [],

  setPosts: (posts) => set({ posts }),
  appendPosts: (posts) =>
    set((state) => {
      const nextPosts = [...state.posts];
      const existingIds = new Set(state.posts.map((post) => post.id));

      for (const post of posts) {
        if (!existingIds.has(post.id)) {
          nextPosts.push(post);
          existingIds.add(post.id);
        }
      }

      return { posts: nextPosts };
    }),

  addReplyCount: (id) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id
          ? { ...post, reply: (post.reply || 0) + 1 }
          : post
      ),
    })),

  subReplyCount: (id) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id
          ? { ...post, reply: Math.max(0, (post.reply || 0) - 1) }
          : post
      ),
    })),

  addPost: (newPost) =>
    set((state) => ({
      posts: [newPost, ...state.posts],
    })),

  deletePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== id),
    })),

  updatePost: (id, newData) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, ...newData } : post
      ),
    })),
}));
