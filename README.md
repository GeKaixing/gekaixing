# Gekaixing

Next.js 16 + TypeScript 的社交平台项目，支持发帖、回复、点赞、收藏、分享、用户资料、关注关系、私聊入口，以及 AI 对话与多语言界面。

## Features

- Social feed: posts / replies / likes / bookmarks / shares
- User profile: avatar、简介、资料编辑
- Relationship graph: followers / following / recommended users
- I18n: `zh-CN` / `en`（`next-intl`）
- AI chat: 基于 Vercel AI SDK（OpenAI / Google）
- Payment hooks: Stripe checkout + webhook
- Storage & auth: Supabase SSR client

## Tech Stack

- Framework: Next.js 16.1.6 (App Router)
- Language: TypeScript (strict)
- Styling: Tailwind CSS v4 + shadcn/ui
- DB: PostgreSQL + Prisma 7
- State: Zustand
- Form: React Hook Form + Zod
- I18n: next-intl

## Project Structure

```text
app/                 Next.js App Router pages and API routes
components/          UI components (shadcn + business components)
lib/                 shared libs (prisma, stripe, utils)
store/               Zustand stores
messages/            i18n dictionaries (en / zh-CN)
utils/               helper functions and Supabase clients
prisma/              schema and migrations
```

## Requirements

- Node.js >= 20
- npm >= 10
- PostgreSQL (local or hosted)
- Supabase project (Auth + Storage)

## Quick Start

```bash
# 1) install dependencies
npm install

# 2) configure env
# create .env.local and fill required variables

# 3) generate prisma client
npx prisma generate

# 4) push schema
npx prisma db push

# 5) (optional) init storage buckets
npm run init:storage

# 6) start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

以下变量按功能分组，至少需要配置核心组。

Core:

- `DATABASE_URL`
- `NEXT_PUBLIC_URL` (or `NEXT_PUBLIC_APP_URL`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Supabase (server/admin actions):

- `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`

AI (optional):

- `GLM_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`

Notion (optional):

- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`

Stripe (optional premium flow):

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Note:

- 当前代码中存在多个 Supabase 变量别名（如 `...PUBLISHABLE_DEFAULT_KEY`、`...SERVICE_ROLE`）。建议统一到一套命名并在代码中收敛。

## Available Scripts

```bash
npm run dev          # start dev server (turbopack)
npm run build        # production build
npm run start        # run production server
npm run lint         # run eslint
npm run init:storage # initialize Supabase storage buckets
```

Prisma:

```bash
npx prisma generate
npx prisma db push
npx prisma migrate dev
npx prisma studio
```

## Deployment

- 推荐 Vercel 部署（Next.js 原生支持）
- 生产环境需完整配置数据库、Supabase、Stripe（如启用支付）
- 首次部署后执行 `prisma db push` 或迁移流程

## Contributing

欢迎 PR 和 Issue。

1. Fork 本仓库并创建分支
2. 保持 TypeScript 严格类型，不使用 `any`
3. 提交前运行：
   - `npm run lint`
   - `npx tsc --noEmit`
4. 提交 PR，说明变更动机与影响范围

## Security

- 不要提交 `.env.local` 或任何密钥
- 若发现安全问题，请通过私下渠道联系维护者，不要公开披露细节

## License

MIT License. See `/LICENSE`.

> 当前 `LICENSE` 中的 `Copyright (c) [year] [fullname]` 仍是占位符，开源前请替换为真实信息。
