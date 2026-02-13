"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Heart,
  UserPlus,
  Repeat2,
  MessageCircle,
  AtSign,
  Verified,
  MoreHorizontal,
} from "lucide-react";

interface Notification {
  id: string;
  type: "like" | "follow" | "repost" | "reply" | "mention" | "verified";
  user: {
    name: string;
    handle: string;
    avatar: string;
  };
  content?: string;
  postContent?: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    user: {
      name: "张三",
      handle: "@zhangsan",
      avatar: "",
    },
    postContent: "这是一条示例推文内容，展示通知页面的样式。",
    time: "2小时前",
    read: false,
  },
  {
    id: "2",
    type: "follow",
    user: {
      name: "李四",
      handle: "@lisi",
      avatar: "",
    },
    time: "5小时前",
    read: false,
  },
  {
    id: "3",
    type: "repost",
    user: {
      name: "王五",
      handle: "@wangwu",
      avatar: "",
    },
    postContent: "分享一个有趣的项目！",
    time: "1天前",
    read: true,
  },
  {
    id: "4",
    type: "reply",
    user: {
      name: "赵六",
      handle: "@zhaoliu",
      avatar: "",
    },
    content: "我也觉得这个项目很棒！",
    postContent: "今天开始一个新的项目...",
    time: "2天前",
    read: true,
  },
  {
    id: "5",
    type: "mention",
    user: {
      name: "钱七",
      handle: "@qianqi",
      avatar: "",
    },
    content: "@gekaixing 你觉得这个设计怎么样？",
    time: "3天前",
    read: true,
  },
  {
    id: "6",
    type: "verified",
    user: {
      name: "系统通知",
      handle: "@system",
      avatar: "",
    },
    content: "恭喜！你的账号已获得认证。",
    time: "1周前",
    read: true,
  },
];

function NotificationIcon({ type }: { type: Notification["type"] }) {
  const iconClass = "w-5 h-5";

  switch (type) {
    case "like":
      return <Heart className={cn(iconClass, "fill-red-500 text-red-500")} />;
    case "follow":
      return <UserPlus className={cn(iconClass, "text-blue-500")} />;
    case "repost":
      return <Repeat2 className={cn(iconClass, "text-green-500")} />;
    case "reply":
      return <MessageCircle className={cn(iconClass, "text-blue-500")} />;
    case "mention":
      return <AtSign className={cn(iconClass, "text-blue-500")} />;
    case "verified":
      return <Verified className={cn(iconClass, "text-blue-500")} />;
    default:
      return null;
  }
}

function getNotificationText(type: Notification["type"]) {
  switch (type) {
    case "like":
      return "赞了你的推文";
    case "follow":
      return "开始关注你";
    case "repost":
      return "转发了你的推文";
    case "reply":
      return "回复了你";
    case "mention":
      return "在推文中提到了你";
    case "verified":
      return "";
    default:
      return "";
  }
}

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div
      className={cn(
        "flex gap-3 p-4 border-b border-border hover:bg-accent/50 transition-colors cursor-pointer",
        !notification.read && "bg-blue-50/50 dark:bg-blue-950/20"
      )}
    >
      <div className="flex-shrink-0 w-10 flex justify-end">
        <NotificationIcon type={notification.type} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={notification.user.avatar} />
              <AvatarFallback className="text-xs">
                {notification.user.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
          <button className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-accent">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-1">
          <span className="font-semibold text-foreground">
            {notification.user.name}
          </span>{" "}
          <span className="text-muted-foreground">
            {notification.user.handle}
          </span>{" "}
          <span className="text-foreground">{getNotificationText(notification.type)}</span>
          <span className="text-muted-foreground text-sm ml-1">
            · {notification.time}
          </span>
        </div>

        {notification.content && (
          <p className="mt-2 text-foreground">{notification.content}</p>
        )}

        {notification.postContent && notification.type !== "mention" && (
          <div className="mt-2 p-3 rounded-xl border border-border bg-muted/50">
            <p className="text-muted-foreground text-sm line-clamp-2">
              {notification.postContent}
            </p>
          </div>
        )}

        {notification.type === "follow" && (
          <button className="mt-3 px-4 py-1.5 rounded-full border border-border font-semibold text-sm hover:bg-accent transition-colors">
            关注回
          </button>
        )}
      </div>
    </div>
  );
}

function NotificationList({
  notifications,
  filter,
}: {
  notifications: Notification[];
  filter: "all" | "mentions";
}) {
  const filteredNotifications =
    filter === "mentions"
      ? notifications.filter(
          (n) => n.type === "mention" || n.type === "reply"
        )
      : notifications;

  if (filteredNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          {filter === "mentions" ? (
            <AtSign className="w-8 h-8 text-muted-foreground" />
          ) : (
            <Heart className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {filter === "mentions" ? "暂无提及" : "暂无通知"}
        </h3>
        <p className="text-muted-foreground text-center max-w-sm">
          {filter === "mentions"
            ? "当有人在推文或回复中提到你时，你会在这里看到。"
            : "当有新的互动时，你会在这里看到通知。"}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {filteredNotifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">通知</h1>
          <button className="p-2 hover:bg-accent rounded-full transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex justify-between bg-transparent border-b border-border rounded-none h-auto p-0">
            <TabsTrigger
              value="all"
              className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent hover:bg-accent/50 transition-colors"
            >
              全部
            </TabsTrigger>
            <TabsTrigger
              value="mentions"
              className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent hover:bg-accent/50 transition-colors"
            >
              提及
            </TabsTrigger>
            <TabsTrigger
              value="verified"
              className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-1">
                <Verified className="w-4 h-4" />
                认证
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <NotificationList notifications={mockNotifications} filter="all" />
          </TabsContent>

          <TabsContent value="mentions" className="mt-0">
            <NotificationList notifications={mockNotifications} filter="mentions" />
          </TabsContent>

          <TabsContent value="verified" className="mt-0">
            <NotificationList
              notifications={mockNotifications.filter((n) => n.type === "verified")}
              filter="all"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
