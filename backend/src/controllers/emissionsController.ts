import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Add User (Individual) Emission
export const createUserEmission = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'INDIVIDUAL') {
      return res.status(403).json({ error: 'Access denied: Requires Individual role' });
    }

    const { country, commuteDistanceKm, wasteGeneratedKg, electricityConsumedKwh, mealsPerDay } = req.body;

    if (!country || commuteDistanceKm === undefined || wasteGeneratedKg === undefined || electricityConsumedKwh === undefined || mealsPerDay === undefined) {
      return res.status(400).json({ error: 'Missing inputs for user calculation' });
    }

    // Calculations
    const commuteCo2 = commuteDistanceKm * 0.05;
    const wasteCo2 = wasteGeneratedKg * 0.1;
    const electricityCo2 = electricityConsumedKwh * 0.4;
    const mealsCo2 = mealsPerDay * 0.3;
    const totalCo2 = Math.round((commuteCo2 + wasteCo2 + electricityCo2 + mealsCo2) * 1000) / 1000.0;

    const record = await prisma.userEmission.create({
      data: {
        userId: req.user.id,
        country,
        commuteDistanceKm: Number(commuteDistanceKm),
        wasteGeneratedKg: Number(wasteGeneratedKg),
        electricityConsumedKwh: Number(electricityConsumedKwh),
        mealsPerDay: Number(mealsPerDay),
        totalEmissionsKg: totalCo2,
      },
    });

    res.status(201).json({
      message: 'Individual emissions calculated and recorded successfully.',
      data: record,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record user emissions' });
  }
};

// Add Industry Emission
export const createIndustryEmission = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'INDUSTRY') {
      return res.status(403).json({ error: 'Access denied: Requires Industry role' });
    }

    const { month, processType, energyConsumedKwh, rawMaterialUsedTons, totalWasteProducedTons, transportationDistanceKm } = req.body;

    if (!month || !processType || energyConsumedKwh === undefined || rawMaterialUsedTons === undefined || totalWasteProducedTons === undefined || transportationDistanceKm === undefined) {
      return res.status(400).json({ error: 'Missing inputs for industry calculation' });
    }

    // Calculations
    const energyCo2 = energyConsumedKwh * 0.92;
    const rawMaterialCo2 = rawMaterialUsedTons * 1.5;
    const wasteCo2 = totalWasteProducedTons * 0.2;
    const transportationCo2 = transportationDistanceKm * 0.05;
    const totalCo2 = Math.round((energyCo2 + rawMaterialCo2 + wasteCo2 + transportationCo2) * 1000) / 1000.0;

    const highEmissionWarning = totalCo2 > 45000.0;

    const record = await prisma.industryEmission.create({
      data: {
        userId: req.user.id,
        month,
        processType,
        energyConsumedKwh: Number(energyConsumedKwh),
        rawMaterialUsedTons: Number(rawMaterialUsedTons),
        totalWasteProducedTons: Number(totalWasteProducedTons),
        transportationDistanceKm: Number(transportationDistanceKm),
        totalEmissionsKg: totalCo2,
      },
    });

    res.status(201).json({
      message: 'Industry emissions calculated and recorded successfully.',
      data: record,
      highEmissionWarning,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record industry emissions' });
  }
};

// Fetch User/Industry History
export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role === 'INDIVIDUAL') {
      const history = await prisma.userEmission.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
      });
      return res.json(history);
    } else if (req.user.role === 'INDUSTRY') {
      const history = await prisma.industryEmission.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
      });
      return res.json(history);
    }

    res.status(400).json({ error: 'Invalid user role for history lookup' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve emission logs' });
  }
};

// Admin Dashboard Analytical Statistics
export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied: Requires Admin role' });
    }

    // Statistics counts
    const totalUsers = await prisma.user.count();
    const individualUsersCount = await prisma.user.count({ where: { role: 'INDIVIDUAL' } });
    const industryUsersCount = await prisma.user.count({ where: { role: 'INDUSTRY' } });

    // Aggregate emissions totals
    const userEmissionsSum = await prisma.userEmission.aggregate({
      _sum: { totalEmissionsKg: true },
      _avg: { totalEmissionsKg: true },
    });

    const industryEmissionsSum = await prisma.industryEmission.aggregate({
      _sum: { totalEmissionsKg: true },
      _avg: { totalEmissionsKg: true },
    });

    // Recent calculations logs
    const recentIndividualLogs = await prisma.userEmission.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    const recentIndustryLogs = await prisma.industryEmission.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    res.json({
      summary: {
        totalUsers,
        individualUsersCount,
        industryUsersCount,
        totalUserEmissionsKg: userEmissionsSum._sum.totalEmissionsKg || 0,
        averageUserEmissionKg: userEmissionsSum._avg.totalEmissionsKg || 0,
        totalIndustryEmissionsKg: industryEmissionsSum._sum.totalEmissionsKg || 0,
        averageIndustryEmissionKg: industryEmissionsSum._avg.totalEmissionsKg || 0,
      },
      recentIndividualLogs,
      recentIndustryLogs,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load administrative analytics statistics' });
  }
};
