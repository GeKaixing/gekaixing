import { UserActionType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

interface LogUserActionInput {
  userId: string;
  actionType: UserActionType;
  targetPostId?: string | null;
  targetAuthorId?: string | null;
  dwellMs?: number | null;
  metadata?: string | null;
}

export async function logUserAction(input: LogUserActionInput): Promise<void> {
  try {
    await prisma.userAction.create({
      data: {
        userId: input.userId,
        actionType: input.actionType,
        targetPostId: input.targetPostId ?? null,
        targetAuthorId: input.targetAuthorId ?? null,
        dwellMs: input.dwellMs ?? null,
        metadata: input.metadata ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to log user action:", error);
  }
}
