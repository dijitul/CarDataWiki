import { createHash } from 'crypto'
import { prisma } from './prisma'

export interface ApiAuthResult {
  apiKeyId: string
  userId: string
}

export async function validateApiKey(authHeader: string | null): Promise<ApiAuthResult | null> {
  if (!authHeader?.startsWith('Bearer ')) return null

  const rawKey = authHeader.slice(7).trim()
  if (!rawKey.startsWith('cdw_')) return null

  const keyHash = createHash('sha256').update(rawKey).digest('hex')

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: { subscription: true },
  })

  if (!apiKey || !apiKey.isActive) return null
  if (apiKey.subscription.status !== 'ACTIVE') return null

  return { apiKeyId: apiKey.id, userId: apiKey.userId }
}

export function generateRawKey(): string {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  const b64 = Buffer.from(bytes).toString('base64url')
  return `cdw_${b64}`
}

export function hashKey(rawKey: string): string {
  return createHash('sha256').update(rawKey).digest('hex')
}

export function keyPrefix(rawKey: string): string {
  return rawKey.slice(0, 12)
}
