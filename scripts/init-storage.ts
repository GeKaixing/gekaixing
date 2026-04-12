import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const STORAGE_BUCKETS = ['images', 'post-image', 'post-media'] as const

async function initStorage(): Promise<void> {
  console.log('checking local storage directories...')

  const baseDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(baseDir, { recursive: true })

  for (const bucket of STORAGE_BUCKETS) {
    const bucketDir = path.join(baseDir, bucket)
    await mkdir(bucketDir, { recursive: true })
    console.log(`ready: ${bucketDir}`)
  }

  console.log('local storage initialized')
}

void initStorage().catch((error: unknown) => {
  console.error('failed to initialize local storage:', error)
  process.exit(1)
})
