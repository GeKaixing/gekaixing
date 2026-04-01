CREATE TABLE "JobPosting" (
  "id" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "locationType" TEXT NOT NULL,
  "seniority" TEXT NOT NULL,
  "employmentType" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "JobPosting_authorId_createdAt_idx" ON "JobPosting"("authorId", "createdAt");

ALTER TABLE "JobPosting"
ADD CONSTRAINT "JobPosting_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;