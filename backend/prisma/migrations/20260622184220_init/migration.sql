-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('INDIVIDUAL', 'INDUSTRY', 'ADMIN') NOT NULL DEFAULT 'INDIVIDUAL',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserEmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `commuteDistanceKm` DOUBLE NOT NULL,
    `wasteGeneratedKg` DOUBLE NOT NULL,
    `electricityConsumedKwh` DOUBLE NOT NULL,
    `mealsPerDay` INTEGER NOT NULL,
    `totalEmissionsKg` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IndustryEmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `month` VARCHAR(191) NOT NULL,
    `processType` VARCHAR(191) NOT NULL,
    `energyConsumedKwh` DOUBLE NOT NULL,
    `rawMaterialUsedTons` DOUBLE NOT NULL,
    `totalWasteProducedTons` DOUBLE NOT NULL,
    `transportationDistanceKm` DOUBLE NOT NULL,
    `totalEmissionsKg` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserEmission` ADD CONSTRAINT `UserEmission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IndustryEmission` ADD CONSTRAINT `IndustryEmission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
