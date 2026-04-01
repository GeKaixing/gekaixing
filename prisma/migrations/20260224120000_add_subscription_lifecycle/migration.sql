-- Add subscription lifecycle fields
CREATE TYPE "SubscriptionStatus" AS ENUM ('FREE', 'ACTIVE', 'GRACE', 'EXPIRED', 'CANCELED');

ALTER TABLE "User"
ADD COLUMN "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'FREE',
ADD COLUMN "premiumExpiresAt" TIMESTAMP(3),
ADD COLUMN "premiumGraceEndsAt" TIMESTAMP(3),
ADD COLUMN "stripePriceId" TEXT;