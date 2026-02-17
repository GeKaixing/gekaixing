/*
  Warnings:

  - You are about to drop the column `lastReadAt` on the `ConversationRead` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,postId]` on the table `Share` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ConversationRead` table without a default value. This is not possible if the table is not empty.
  - The required column `userid` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "FollowStatus" AS ENUM ('FOLLOWING', 'BLOCKED', 'REQUESTED');

-- DropIndex
DROP INDEX "Post_rootId_idx";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "messageCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ConversationRead" DROP COLUMN "lastReadAt",
ADD COLUMN     "lastReadMessageCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'text',
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "starCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userid" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "status" "FollowStatus" NOT NULL DEFAULT 'FOLLOWING',
    "muted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "Post_rootId_createdAt_idx" ON "Post"("rootId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Share_userId_postId_key" ON "Share"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userid_key" ON "User"("userid");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
