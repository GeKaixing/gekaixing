-- CreateEnum
CREATE TYPE "UserActionType" AS ENUM (
    'FEED_IMPRESSION',
    'POST_CREATE',
    'REPLY_CREATE',
    'POST_LIKE',
    'POST_UNLIKE',
    'POST_BOOKMARK',
    'POST_UNBOOKMARK',
    'POST_SHARE',
    'FOLLOW',
    'UNFOLLOW',
    'POST_CLICK',
    'DWELL'
);

-- CreateTable
CREATE TABLE "UserAction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionType" "UserActionType" NOT NULL,
    "targetPostId" TEXT,
    "targetAuthorId" TEXT,
    "dwellMs" INTEGER,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserAction_userId_createdAt_idx" ON "UserAction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserAction_targetAuthorId_createdAt_idx" ON "UserAction"("targetAuthorId", "createdAt");

-- CreateIndex
CREATE INDEX "UserAction_targetPostId_createdAt_idx" ON "UserAction"("targetPostId", "createdAt");

-- CreateIndex
CREATE INDEX "UserAction_actionType_createdAt_idx" ON "UserAction"("actionType", "createdAt");

-- AddForeignKey
ALTER TABLE "UserAction" ADD CONSTRAINT "UserAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAction" ADD CONSTRAINT "UserAction_targetPostId_fkey" FOREIGN KEY ("targetPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
