/**
 * One-shot admin password reset.
 * Run:  set -a && source .env && set +a && npx tsx scripts/reset-admin-pw.ts
 */
import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@cardata.wiki'
const NEW_PASSWORD = '1JIR4Y9fSxf1X0N'

async function main() {
  // Show all users so we know what email exists
  const allUsers = await prisma.user.findMany({ select: { email: true, role: true } })
  console.log('Users in DB:', allUsers)

  const hash = await bcrypt.hash(NEW_PASSWORD, 12)

  const user = await prisma.user.upsert({
    where:  { email: ADMIN_EMAIL },
    update: { passwordHash: hash, role: 'ADMIN' },
    create: {
      email:        ADMIN_EMAIL,
      name:         'Admin',
      passwordHash: hash,
      role:         'ADMIN',
    },
    select: { email: true, role: true },
  })

  console.log(`✓ Password set for ${user.email} (role: ${user.role})`)
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
