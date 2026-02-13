# AGENTS.md - Coding Guidelines for gekaixing

Next.js 16+ social platform with TypeScript, Tailwind CSS v4, Prisma, Supabase. Features: posts, replies, likes, sharing, user profiles.

## Commands

```bash
npm run dev              # Start dev server with Turbopack (port 3000)
npm run build            # Build for production (runs typecheck + lint)
npm run start            # Start production server
npm run lint             # Run ESLint on entire codebase
npm run lint -- --fix    # Run ESLint with auto-fix
npx tsc --noEmit         # TypeScript type checking only
```

No unit tests exist.

## Code Style

### TypeScript
- Strict mode enabled
- Explicit return types and parameter types required
- Interfaces for object shapes, types for unions/primitives

```typescript
interface Post {
  id: string;
  content: string;
  like: number;
}

export function fetchPosts(postId: string): Promise<Post> {}
```

### Imports
Three groups: external libs, components, utils. Use `@/*` path aliases.

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
```

### Components
- Client: `"use client"` at top
- PascalCase names, default exports
- Props interface first

```typescript
"use client";
import { Button } from '@/components/ui/button';
interface PostCardProps { id: string; content: string; onLike?: () => void; }
export default function PostCard({ id, content, onLike }: PostCardProps) {}
```

### State Management (Zustand)
Define interfaces, use functional updates.

```typescript
import { create } from 'zustand';
interface PostStore { posts: Post[]; addPost: (post: Post) => void; }
export const postStore = create<PostStore>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
}));
```

### Database (Prisma)
All exports from `lib/prisma.ts`. Handle async with try/catch.

```typescript
import { prisma } from '@/lib/prisma';
export async function getPost(id: string) {
  try { return await prisma.post.findUnique({ where: { id } }); }
  catch (error) { console.error('Failed to fetch post:', error); return null; }
}
```

### Supabase
- Client: `createClient()` from `@/utils/supabase/client`
- Server: `createServerClient()` from `@supabase/ssr`

### Styling (Tailwind CSS v4)
Use `cn()` helper. Follow shadcn/ui conventions (`new-york` style).

```typescript
import { cn } from '@/lib/utils';
<div className={cn("base", cond && "conditional", className)} />
```

### Error Handling
Try/catch for async. Log errors with context.

```typescript
try { if (error) throw error; return data; }
catch (error) { console.error('Failed:', error); return []; }
```

### API Routes
Use `app/api/`. Return proper NextResponse.

```typescript
import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json(data); }
```

### Naming
| Type | Convention |
|------|------------|
| Variables/Functions | camelCase |
| Components/Types | PascalCase |
| Constants | SCREAMING_SNAKE_CASE |
| Files | PascalCase (components), kebab-case (utils) |
| DB Tables | snake_case (Prisma) |

### File Organization
```
├── app/               # Next.js App Router
├── components/       # ui/, gekaixing/
├── lib/              # prisma.ts, utils.ts
├── store/            # Zustand stores
├── messages/         # i18n
├── utils/            # Helpers
├── prisma/           # Schema
└── public/           # Static
```

### Environment Variables
Never commit `.env.local`. Required: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Misc
- ESLint: `next/core-web-vitals`, `next/typescript`
- No comments unless explaining complex logic
- Single responsibility, extract to hooks
- React Server Components by default, client only when needed
