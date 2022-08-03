/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    ADD COLUMN `status` ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);
