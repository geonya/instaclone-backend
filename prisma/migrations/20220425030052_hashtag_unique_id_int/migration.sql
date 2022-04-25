/*
  Warnings:

  - You are about to drop the column `hashtagId` on the `Photo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hashtag]` on the table `Hashtag` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "hashtagId";

-- CreateIndex
CREATE UNIQUE INDEX "Hashtag_hashtag_key" ON "Hashtag"("hashtag");
