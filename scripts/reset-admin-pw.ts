/**
 * One-shot admin password reset.
 * Run:  set -a && source .env && set +a && npx tsx scripts/reset-admin-pw.ts
 */
import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@cardata.wiki'
const NEW_PASSWORD = '1JIR4Y9fSxf1X0N'

async function main() {
  const hash = await bcrypt.hash(NEW_PASSWORD, 12)

  const user = await prisma.user.update({
    where: { email: ADMIN_EMAIL },
    data:  { passwordHash: hash },
    select: { email: true, role: true },
  })

  console.log(`✓ Password reset for ${user.email} (role: ${user.role})`)
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
