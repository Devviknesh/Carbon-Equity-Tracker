import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('root', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // Seed user '1' (INDIVIDUAL)
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@tracker.com' },
    update: {},
    create: {
      name: 'User One',
      email: 'user1@tracker.com',
      passwordHash,
      role: Role.INDIVIDUAL,
      phone: '+12345678901',
    },
  });

  // Seed user '100' (INDUSTRY)
  const user100 = await prisma.user.upsert({
    where: { email: 'industry100@tracker.com' },
    update: {},
    create: {
      name: 'Industry 100',
      email: 'industry100@tracker.com',
      passwordHash,
      role: Role.INDUSTRY,
      phone: '+19876543210',
    },
  });

  // Seed admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tracker.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@tracker.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      phone: '+15555555555',
    },
  });

  console.log('Seeded users successfully:', {
    user1: user1.email,
    user100: user100.email,
    admin: admin.email
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
