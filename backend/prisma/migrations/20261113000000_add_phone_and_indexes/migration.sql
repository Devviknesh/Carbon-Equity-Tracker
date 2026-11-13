-- Add phone column to User table (nullable)
ALTER TABLE `User` ADD COLUMN `phone` VARCHAR(191) NULL;

-- Add indexes that exist in the schema but were missing from initial migration
ALTER TABLE `User` ADD INDEX `User_email_idx`(`email`);
ALTER TABLE `User` ADD INDEX `User_role_idx`(`role`);
ALTER TABLE `UserEmission` ADD INDEX `UserEmission_createdAt_idx`(`createdAt`);
ALTER TABLE `UserEmission` ADD INDEX `UserEmission_userId_createdAt_idx`(`userId`, `createdAt`);
ALTER TABLE `IndustryEmission` ADD INDEX `IndustryEmission_createdAt_idx`(`createdAt`);
ALTER TABLE `IndustryEmission` ADD INDEX `IndustryEmission_userId_createdAt_idx`(`userId`, `createdAt`);
ALTER TABLE `IndustryEmission` ADD INDEX `IndustryEmission_processType_idx`(`processType`);
