/**
 * Prisma seed — creates a default admin user.
 * Run with: npm run db:seed
 *
 * After seeding, run the data import:
 * npm run import:data
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@cardata.wiki'
  const adminPass  = process.env.ADMIN_PASSWORD ?? 'changeme123'

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (existing) {
    console.log(`Admin user already exists: ${adminEmail}`)
    return
  }

  const passwordHash = await bcrypt.hash(adminPass, 12)
  const admin = await prisma.user.create({
    data: { email: adminEmail, name: 'Admin', passwordHash, role: 'ADMIN' },
  })
  console.log(`✅ Admin user created: ${admin.email}`)
  console.log(`   Password: ${adminPass} (change this immediately!)`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
