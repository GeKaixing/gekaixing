CREATE TABLE IF NOT EXISTS "UserSettings" (
  "userId" TEXT NOT NULL,
  "geminiApiKey" TEXT,
  "geminiModel" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("userId")
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'UserSettings_userId_fkey'
  ) THEN
    ALTER TABLE "UserSettings"
    ADD CONSTRAINT "UserSettings_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
