-- CreateTable
CREATE TABLE "ChatAISession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '新对话',
    "tokenUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatAISession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatAIMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatAIMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatAISession_userId_idx" ON "ChatAISession"("userId");

-- CreateIndex
CREATE INDEX "ChatAIMessage_sessionId_createdAt_idx" ON "ChatAIMessage"("sessionId", "createdAt");

-- AddForeignKey
ALTER TABLE "ChatAIMessage" ADD CONSTRAINT "ChatAIMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatAISession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
