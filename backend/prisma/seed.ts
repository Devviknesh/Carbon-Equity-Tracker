import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('root', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // Seed user '1' (INDIVIDUAL)
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@tracker.com' },
    update: { passwordHash },
    create: {
      name: 'User One',
      email: 'user1@tracker.com',
      passwordHash,
      role: Role.INDIVIDUAL,
    },
  });

  // Seed user '100' (INDUSTRY)
  const user100 = await prisma.user.upsert({
    where: { email: 'industry100@tracker.com' },
    update: { passwordHash },
    create: {
      name: 'Industry 100',
      email: 'industry100@tracker.com',
      passwordHash,
      role: Role.INDUSTRY,
    },
  });

  // Seed admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tracker.com' },
    update: { passwordHash: adminPasswordHash },
    create: {
      name: 'System Admin',
      email: 'admin@tracker.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  // Seed synthetic demonstration emission records if empty
  const userEmissionCount = await prisma.userEmission.count({ where: { userId: user1.id } });
  if (userEmissionCount === 0) {
    await prisma.userEmission.createMany({
      data: [
        {
          userId: user1.id,
          country: 'India',
          commuteDistanceKm: 25,
          wasteGeneratedKg: 10,
          electricityConsumedKwh: 150,
          mealsPerDay: 3,
          totalEmissionsKg: 63.15,
        },
        {
          userId: user1.id,
          country: 'India',
          commuteDistanceKm: 15,
          wasteGeneratedKg: 8,
          electricityConsumedKwh: 120,
          mealsPerDay: 3,
          totalEmissionsKg: 50.45,
        },
      ],
    });
  }

  const industryEmissionCount = await prisma.industryEmission.count({ where: { userId: user100.id } });
  if (industryEmissionCount === 0) {
    await prisma.industryEmission.createMany({
      data: [
        {
          userId: user100.id,
          month: 'January',
          processType: 'Manufacturing',
          energyConsumedKwh: 25000,
          rawMaterialUsedTons: 5.5,
          totalWasteProducedTons: 3000,
          transportationDistanceKm: 1500,
          totalEmissionsKg: 23683.25,
        },
      ],
    });
  }

  console.log('Seeded users and demo emission records successfully:', {
    user1: user1.email,
    user100: user100.email,
    admin: admin.email,
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
