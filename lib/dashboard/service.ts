import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type {
  DashboardAcquireHandlesData,
  DashboardActionLogItem,
  DashboardAffiliationItem,
  DashboardAffiliationsData,
  DashboardBillingData,
  DashboardConversationItem,
  DashboardHandleItem,
  DashboardHireTalentData,
  DashboardHomeData,
  DashboardPremiumUserItem,
  DashboardRadarData,
  DashboardSettingsData,
  DashboardSupportData,
  DashboardTalentItem,
  DashboardTrendPoint,
  DashboardUserActionItem,
} from "@/lib/dashboard/types";

const DEFAULT_HOME_DATA: DashboardHomeData = {
  summary: {
    totalUsers: 0,
    totalPremiumUsers: 0,
    totalPosts: 0,
    totalReplies: 0,
    totalMessages: 0,
    weeklyNewUsers: 0,
    weeklyNewPosts: 0,
  },
  trend: [],
  recentPosts: [],
};

function formatDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getRecentDayKeys(days: number): string[] {
  const today = new Date();
  const keys: string[] = [];

  for (let index = days - 1; index >= 0; index -= 1) {
    const current = new Date(today);
    current.setDate(today.getDate() - index);
    keys.push(formatDayKey(current));
  }

  return keys;
}

function toTrendMap(keys: string[]): Map<string, DashboardTrendPoint> {
  return new Map<string, DashboardTrendPoint>(
    keys.map((key) => [
      key,
      {
        date: key,
        posts: 0,
        replies: 0,
      },
    ])
  );
}

export const getDashboardHomeData = cache(async (userId: string | null): Promise<DashboardHomeData> => {
  if (!userId) {
    return DEFAULT_HOME_DATA;
  }

  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      followingCount,
      followerCount,
      myPosts,
      myReplies,
      myMessages,
      weeklyReplies,
      weeklyPosts,
      recentPosts,
      recentPostRows,
    ] = await Promise.all([
      prisma.follow.count({ where: { followerId: userId, status: "FOLLOWING" } }),
      prisma.follow.count({ where: { followingId: userId, status: "FOLLOWING" } }),
      prisma.post.count({ where: { authorId: userId, parentId: null } }),
      prisma.post.count({ where: { authorId: userId, parentId: { not: null } } }),
      prisma.message.count({ where: { senderId: userId } }),
      prisma.post.count({ where: { authorId: userId, parentId: { not: null }, createdAt: { gte: weekAgo } } }),
      prisma.post.count({ where: { authorId: userId, parentId: null, createdAt: { gte: weekAgo } } }),
      prisma.post.findMany({
        where: { authorId: userId, parentId: null },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          content: true,
          createdAt: true,
          likeCount: true,
          replyCount: true,
          shareCount: true,
          author: {
            select: {
              name: true,
              userid: true,
            },
          },
        },
      }),
      prisma.post.findMany({
        where: {
          authorId: userId,
          createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 13)) },
        },
        select: {
          createdAt: true,
          parentId: true,
        },
      }),
    ]);

    const keys = getRecentDayKeys(14);
    const trendMap = toTrendMap(keys);

    recentPostRows.forEach((item) => {
      const dayKey = formatDayKey(item.createdAt);
      const target = trendMap.get(dayKey);

      if (!target) {
        return;
      }

      if (item.parentId) {
        target.replies += 1;
      } else {
        target.posts += 1;
      }
    });

    return {
      summary: {
        totalUsers: followingCount,
        totalPremiumUsers: followerCount,
        totalPosts: myPosts,
        totalReplies: myReplies,
        totalMessages: myMessages,
        weeklyNewUsers: weeklyPosts,
        weeklyNewPosts: weeklyReplies,
      },
      trend: keys.map((key) => trendMap.get(key) as DashboardTrendPoint),
      recentPosts,
    };
  } catch (error) {
    console.error("Failed to get dashboard home data:", error);
    return DEFAULT_HOME_DATA;
  }
});

export const getDashboardAffiliationsData = cache(async (userId: string | null): Promise<DashboardAffiliationsData> => {
  if (!userId) {
    return {
      summary: {
        totalLinks: 0,
        followingLinks: 0,
        blockedLinks: 0,
        requestedLinks: 0,
      },
      links: [],
    };
  }

  try {
    const baseWhere = {
      OR: [{ followerId: userId }, { followingId: userId }],
    };

    const [totalLinks, followingLinks, blockedLinks, requestedLinks, links] = await Promise.all([
      prisma.follow.count({ where: baseWhere }),
      prisma.follow.count({ where: { ...baseWhere, status: "FOLLOWING" } }),
      prisma.follow.count({ where: { ...baseWhere, status: "BLOCKED" } }),
      prisma.follow.count({ where: { ...baseWhere, status: "REQUESTED" } }),
      prisma.follow.findMany({
        where: baseWhere,
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          status: true,
          createdAt: true,
          follower: {
            select: {
              userid: true,
              name: true,
            },
          },
          following: {
            select: {
              userid: true,
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      summary: {
        totalLinks,
        followingLinks,
        blockedLinks,
        requestedLinks,
      },
      links: links as DashboardAffiliationItem[],
    };
  } catch (error) {
    console.error("Failed to get dashboard affiliations data:", error);
    return {
      summary: {
        totalLinks: 0,
        followingLinks: 0,
        blockedLinks: 0,
        requestedLinks: 0,
      },
      links: [],
    };
  }
});

const ACTION_TYPES = [
  "FEED_IMPRESSION",
  "POST_CREATE",
  "REPLY_CREATE",
  "POST_LIKE",
  "POST_UNLIKE",
  "POST_BOOKMARK",
  "POST_UNBOOKMARK",
  "POST_SHARE",
  "FOLLOW",
  "UNFOLLOW",
  "POST_CLICK",
  "DWELL",
] as const;

export const getDashboardRadarData = cache(async (userId: string | null): Promise<DashboardRadarData> => {
  if (!userId) {
    return {
      actionSummary: [],
      trend: [],
    };
  }

  try {
    const [actionCounts, recentActions] = await Promise.all([
      Promise.all(
        ACTION_TYPES.map(async (actionType) => {
          const count = await prisma.userAction.count({ where: { userId, actionType } });
          return {
            actionType,
            count,
          };
        })
      ),
      prisma.userAction.findMany({
        where: {
          userId,
          createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 13)) },
        },
        select: {
          actionType: true,
          createdAt: true,
        },
      }),
    ]);

    const keys = getRecentDayKeys(14);
    const trendMap = new Map<string, { postCreate: number; replyCreate: number }>(
      keys.map((key) => [key, { postCreate: 0, replyCreate: 0 }])
    );

    recentActions.forEach((item) => {
      const dayKey = formatDayKey(item.createdAt);
      const target = trendMap.get(dayKey);

      if (!target) {
        return;
      }

      if (item.actionType === "POST_CREATE") {
        target.postCreate += 1;
      }

      if (item.actionType === "REPLY_CREATE") {
        target.replyCreate += 1;
      }
    });

    const actionSummary: DashboardUserActionItem[] = actionCounts
      .sort((left, right) => right.count - left.count)
      .filter((item) => item.count > 0);

    return {
      actionSummary,
      trend: keys.map((key) => {
        const value = trendMap.get(key);

        return {
          date: key,
          posts: value?.postCreate ?? 0,
          replies: value?.replyCreate ?? 0,
        };
      }),
    };
  } catch (error) {
    console.error("Failed to get dashboard radar data:", error);
    return {
      actionSummary: [],
      trend: [],
    };
  }
});

export const getDashboardAcquireHandlesData = cache(async (userId: string | null): Promise<DashboardAcquireHandlesData> => {
  if (!userId) {
    return {
      summary: {
        totalUsers: 0,
        premiumUsers: 0,
        activeCreators: 0,
      },
      handles: [],
    };
  }

  try {
    const followings = await prisma.follow.findMany({
      where: {
        followerId: userId,
        status: "FOLLOWING",
      },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        following: {
          select: {
            id: true,
            userid: true,
            name: true,
            isPremium: true,
            createdAt: true,
            _count: {
              select: {
                posts: true,
                followers: true,
              },
            },
          },
        },
      },
    });

    const handles: DashboardHandleItem[] = followings.map((item) => ({
      id: item.following.id,
      userid: item.following.userid,
      name: item.following.name,
      isPremium: item.following.isPremium,
      createdAt: item.following.createdAt,
      postCount: item.following._count.posts,
      followerCount: item.following._count.followers,
    }));

    const activeCreators = handles.filter((item) => item.postCount >= 5).length;

    return {
      summary: {
        totalUsers: handles.length,
        premiumUsers: handles.filter((item) => item.isPremium).length,
        activeCreators,
      },
      handles,
    };
  } catch (error) {
    console.error("Failed to get dashboard acquire handles data:", error);
    return {
      summary: {
        totalUsers: 0,
        premiumUsers: 0,
        activeCreators: 0,
      },
      handles: [],
    };
  }
});

export const getDashboardHireTalentData = cache(async (userId: string | null): Promise<DashboardHireTalentData> => {
  if (!userId) {
    return {
      summary: {
        activeCreators: 0,
        highSignalCreators: 0,
      },
      talents: [],
    };
  }

  try {
    const followingRows = await prisma.follow.findMany({
      where: {
        followerId: userId,
        status: "FOLLOWING",
      },
      select: {
        followingId: true,
      },
    });

    const authorIds = followingRows.map((item) => item.followingId);

    if (!authorIds.length) {
      return {
        summary: {
          activeCreators: 0,
          highSignalCreators: 0,
        },
        talents: [],
      };
    }

    const postRows = await prisma.post.findMany({
      where: {
        authorId: { in: authorIds },
      },
      select: {
        authorId: true,
        parentId: true,
        likeCount: true,
        replyCount: true,
        shareCount: true,
      },
    });

    const perAuthor = new Map<
      string,
      {
        postCount: number;
        replyCount: number;
        likeCount: number;
        shareCount: number;
      }
    >();

    postRows.forEach((item) => {
      const base = perAuthor.get(item.authorId) ?? {
        postCount: 0,
        replyCount: 0,
        likeCount: 0,
        shareCount: 0,
      };

      if (item.parentId) {
        base.replyCount += 1;
      } else {
        base.postCount += 1;
      }

      base.likeCount += item.likeCount;
      base.shareCount += item.shareCount;
      perAuthor.set(item.authorId, base);
    });

    const users = await prisma.user.findMany({
      where: { id: { in: [...perAuthor.keys()] } },
      select: {
        id: true,
        userid: true,
        name: true,
      },
    });

    const userMap = new Map(users.map((item) => [item.id, item]));

    const talents: DashboardTalentItem[] = [...perAuthor.entries()]
      .map(([authorId, metrics]) => {
        const user = userMap.get(authorId);

        if (!user) {
          return null;
        }

        const score =
          metrics.postCount * 2 +
          metrics.replyCount +
          metrics.likeCount * 3 +
          metrics.shareCount * 4;

        return {
          authorId,
          userid: user.userid,
          name: user.name,
          postCount: metrics.postCount,
          replyCount: metrics.replyCount,
          likeCount: metrics.likeCount,
          shareCount: metrics.shareCount,
          score,
        };
      })
      .filter((item): item is DashboardTalentItem => item !== null)
      .sort((left, right) => right.score - left.score)
      .slice(0, 20);

    return {
      summary: {
        activeCreators: talents.length,
        highSignalCreators: talents.filter((item) => item.score >= 50).length,
      },
      talents,
    };
  } catch (error) {
    console.error("Failed to get dashboard hire talent data:", error);
    return {
      summary: {
        activeCreators: 0,
        highSignalCreators: 0,
      },
      talents: [],
    };
  }
});

export const getDashboardSupportData = cache(async (userId: string | null): Promise<DashboardSupportData> => {
  if (!userId) {
    return {
      summary: {
        totalConversations: 0,
        conversationsWithRecentActivity: 0,
        stalledConversations: 0,
      },
      conversations: [],
    };
  }

  try {
    const baseWhere = {
      participants: {
        some: { userId },
      },
    };

    const [totalConversations, conversations] = await Promise.all([
      prisma.conversation.count({ where: baseWhere }),
      prisma.conversation.findMany({
        where: baseWhere,
        orderBy: { updatedAt: "desc" },
        take: 20,
        select: {
          id: true,
          isGroup: true,
          name: true,
          updatedAt: true,
          messageCount: true,
          participants: {
            take: 3,
            select: {
              user: {
                select: {
                  id: true,
                  userid: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const recentBoundary = new Date();
    recentBoundary.setDate(recentBoundary.getDate() - 2);

    const supportConversations: DashboardConversationItem[] = conversations.map((item) => ({
      id: item.id,
      isGroup: item.isGroup,
      name: item.name,
      messageCount: item.messageCount,
      updatedAt: item.updatedAt,
      participants: item.participants.map((participant) => ({
        id: participant.user.id,
        userid: participant.user.userid,
        name: participant.user.name,
      })),
    }));

    const conversationsWithRecentActivity = supportConversations.filter(
      (item) => item.updatedAt >= recentBoundary
    ).length;

    return {
      summary: {
        totalConversations,
        conversationsWithRecentActivity,
        stalledConversations: Math.max(totalConversations - conversationsWithRecentActivity, 0),
      },
      conversations: supportConversations,
    };
  } catch (error) {
    console.error("Failed to get dashboard support data:", error);
    return {
      summary: {
        totalConversations: 0,
        conversationsWithRecentActivity: 0,
        stalledConversations: 0,
      },
      conversations: [],
    };
  }
});

export const getDashboardBillingData = cache(async (userId: string | null): Promise<DashboardBillingData> => {
  if (!userId) {
    return {
      summary: {
        totalUsers: 0,
        premiumUsers: 0,
        premiumRate: 0,
        newPremiumUsers7d: 0,
      },
      premiumUsers: [],
    };
  }

  try {
    const boundary = new Date();
    boundary.setDate(boundary.getDate() - 7);

    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        userid: true,
        name: true,
        createdAt: true,
        isPremium: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!me) {
      return {
        summary: {
          totalUsers: 0,
          premiumUsers: 0,
          premiumRate: 0,
          newPremiumUsers7d: 0,
        },
        premiumUsers: [],
      };
    }

    const isNewPremium = me.isPremium && me.createdAt >= boundary;

    const premiumUsersRows: DashboardPremiumUserItem[] = me.isPremium
      ? [
          {
            id: me.id,
            userid: me.userid,
            name: me.name,
            createdAt: me.createdAt,
            postCount: me._count.posts,
          },
        ]
      : [];

    return {
      summary: {
        totalUsers: 1,
        premiumUsers: me.isPremium ? 1 : 0,
        premiumRate: me.isPremium ? 100 : 0,
        newPremiumUsers7d: isNewPremium ? 1 : 0,
      },
      premiumUsers: premiumUsersRows,
    };
  } catch (error) {
    console.error("Failed to get dashboard billing data:", error);
    return {
      summary: {
        totalUsers: 0,
        premiumUsers: 0,
        premiumRate: 0,
        newPremiumUsers7d: 0,
      },
      premiumUsers: [],
    };
  }
});

export const getDashboardSettingsData = cache(async (userId: string | null): Promise<DashboardSettingsData> => {
  if (!userId) {
    return {
      summary: {
        totalActions: 0,
        actionsToday: 0,
        environmentReady: false,
      },
      recentActions: [],
    };
  }

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    async function runWithRetry<T>(task: () => Promise<T>, label: string): Promise<T> {
      try {
        return await task();
      } catch (firstError) {
        console.warn(`Retrying dashboard settings query (${label}) after transient failure.`, firstError);
        await new Promise<void>((resolve) => setTimeout(resolve, 150));
        return task();
      }
    }

    const totalActions = await runWithRetry(
      () => prisma.userAction.count({ where: { userId } }),
      "totalActions"
    );

    const actionsToday = await runWithRetry(
      () => prisma.userAction.count({ where: { userId, createdAt: { gte: todayStart } } }),
      "actionsToday"
    );

    const recentActions = await runWithRetry(
      () =>
        prisma.userAction.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 30,
          select: {
            id: true,
            actionType: true,
            createdAt: true,
            targetPostId: true,
            user: {
              select: {
                userid: true,
                name: true,
              },
            },
          },
        }),
      "recentActions"
    );

    const recentActionRows: DashboardActionLogItem[] = recentActions.map((item) => ({
      id: item.id,
      actionType: item.actionType,
      createdAt: item.createdAt,
      targetPostId: item.targetPostId,
      user: {
        userid: item.user.userid,
        name: item.user.name,
      },
    }));

    return {
      summary: {
        totalActions,
        actionsToday,
        environmentReady: true,
      },
      recentActions: recentActionRows,
    };
  } catch (error) {
    console.error("Failed to get dashboard settings data:", error);
    return {
      summary: {
        totalActions: 0,
        actionsToday: 0,
        environmentReady: false,
      },
      recentActions: [],
    };
  }
});
