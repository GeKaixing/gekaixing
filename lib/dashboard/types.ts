export interface DashboardSummary {
  totalUsers: number;
  totalPremiumUsers: number;
  totalPosts: number;
  totalReplies: number;
  totalMessages: number;
  weeklyNewUsers: number;
  weeklyNewPosts: number;
}

export interface DashboardTrendPoint {
  date: string;
  posts: number;
  replies: number;
}

export interface DashboardRecentPost {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  replyCount: number;
  shareCount: number;
  author: {
    name: string | null;
    userid: string;
  };
}

export interface DashboardAffiliationItem {
  id: string;
  status: string;
  createdAt: Date;
  follower: {
    userid: string;
    name: string | null;
  };
  following: {
    userid: string;
    name: string | null;
  };
}

export interface DashboardUserActionItem {
  actionType: string;
  count: number;
}

export interface DashboardHandleItem {
  id: string;
  userid: string;
  name: string | null;
  isPremium: boolean;
  createdAt: Date;
  postCount: number;
  followerCount: number;
}

export interface DashboardTalentItem {
  authorId: string;
  userid: string;
  name: string | null;
  postCount: number;
  replyCount: number;
  likeCount: number;
  shareCount: number;
  score: number;
}

export interface DashboardConversationItem {
  id: string;
  isGroup: boolean;
  name: string | null;
  messageCount: number;
  updatedAt: Date;
  participants: Array<{
    id: string;
    userid: string;
    name: string | null;
  }>;
}

export interface DashboardPremiumUserItem {
  id: string;
  userid: string;
  name: string | null;
  createdAt: Date;
  postCount: number;
}

export interface DashboardActionLogItem {
  id: string;
  actionType: string;
  createdAt: Date;
  user: {
    userid: string;
    name: string | null;
  };
  targetPostId: string | null;
}

export interface DashboardHomeData {
  summary: DashboardSummary;
  trend: DashboardTrendPoint[];
  recentPosts: DashboardRecentPost[];
}

export interface DashboardAffiliationsData {
  summary: {
    totalLinks: number;
    followingLinks: number;
    blockedLinks: number;
    requestedLinks: number;
  };
  links: DashboardAffiliationItem[];
}

export interface DashboardRadarData {
  actionSummary: DashboardUserActionItem[];
  trend: DashboardTrendPoint[];
}

export interface DashboardAcquireHandlesData {
  summary: {
    totalUsers: number;
    premiumUsers: number;
    activeCreators: number;
  };
  handles: DashboardHandleItem[];
}

export interface DashboardHireTalentData {
  summary: {
    activeCreators: number;
    highSignalCreators: number;
  };
  talents: DashboardTalentItem[];
}

export interface DashboardSupportData {
  summary: {
    totalConversations: number;
    conversationsWithRecentActivity: number;
    stalledConversations: number;
  };
  conversations: DashboardConversationItem[];
}

export interface DashboardBillingData {
  summary: {
    totalUsers: number;
    premiumUsers: number;
    premiumRate: number;
    newPremiumUsers7d: number;
  };
  premiumUsers: DashboardPremiumUserItem[];
}

export interface DashboardSettingsData {
  summary: {
    totalActions: number;
    actionsToday: number;
    environmentReady: boolean;
  };
  recentActions: DashboardActionLogItem[];
}
