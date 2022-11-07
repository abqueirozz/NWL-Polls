/*
  Warnings:

  - A unique constraint covering the columns `[goolgeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "goolgeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_goolgeId_key" ON "User"("goolgeId");
