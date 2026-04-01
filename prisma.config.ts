import dotenv from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// 根据 NODE_ENV 自动加载环境变量
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production.local'
    : '.env.development.local'

dotenv.config({ path: envFile })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DIRECT_URL || env('DATABASE_URL'),
  },
})
